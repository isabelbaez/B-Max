import cv2
import numpy as np
import json
import matplotlib.pyplot as plt
from scipy.fft import fft
from scipy.signal import detrend, hamming, find_peaks


def preprocess_signal(signal):
    # Detrend the signal
    signal = detrend(signal)
    # Apply a window
    window = hamming(len(signal))
    return signal * window

def clean_data(r_data):
    mean_r = np.mean(r_data)
    std_r = np.std(r_data)

    # Define a threshold for detecting outliers
    threshold = 2 * std_r  # This is a typical choice, but you can adjust it

    # Identify outliers
    outliers = np.where(np.abs(r_data - mean_r) > threshold)[0]

    # Replace outliers with the average of their neighbors
    # print(len(outliers), len(r_data))
    for index in outliers:
        if index == 0:
            # If the outlier is at the start, average with the next value
            r_data[index] = np.mean(r_data[index + 1:index + 2])
        elif index == len(r_data) - 1:
            # If the outlier is at the end, average with the previous value
            r_data[index] = np.mean(r_data[index - 1:index])
        else:
            # Average with the previous and next values
            r_data[index] = np.mean(r_data[index - 1:index + 2])


def get_color_forhead_signals(filename, json_filename = False):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

    # Initialize video capture
    alpha = 0.9
    prev_mean_intensity = None

    cap = cv2.VideoCapture(filename)

    signal = []

    while True:
        # n+=1
        # Read a frame from the video stream
        ret, frame = cap.read()
        if not ret:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=11, minSize=(100, 100))
        if (len(faces) != 1):
            print("ew face", len(signal))
        for (x, y, w, h) in faces:
            roi_face = frame[y:y+h, x:x+w]
            roi_gray = gray[y:y+h, x:x+w]
            eyes = eye_cascade.detectMultiScale(roi_gray)
            min_h = h
            for (x_e, y_e, w_e, h_e) in eyes:
                min_h = min(min_h, y_e)
            roi = frame[y:y+min_h, x + int(w*0.3): x+w-int(w*0.3)]
            b_mean = np.mean(roi[:, :, 0])  # Blue channel
            g_mean = np.mean(roi[:, :, 1])  # Green channel
            r_mean = np.mean(roi[:, :, 2])  # Red channel
            signal.append([b_mean, g_mean, r_mean])

            # roi_filename = f"foreheads_hr12/roi_frame_{len(signal)}.png"  # Save each ROI with a unique filename
            # cv2.imwrite(roi_filename, roi)
            break
        
    cap.release()
    if json_filename:
        with open(json_filename, 'w') as json_file:
            json.dump(signal, json_file)
    print(len(signal))
    return signal



def find_heart_rate(fft_data, frame_rate, num_samples):
    bpm_range = [60, 120]
    freq_range = [bpm / 60 for bpm in bpm_range]
    index_range = [int(freq * num_samples / frame_rate) for freq in freq_range]
    
    peaks, _ = find_peaks(fft_data[index_range[0]:index_range[1]])
    peak_freqs = peaks + index_range[0]
    heart_rates = [(freq * frame_rate * 60 / num_samples) for freq in peak_freqs]
    peak_powers = fft_data[peak_freqs]

    # Find the highest peak within the range
    if len(peak_powers) > 0:
        max_idx = np.argmax(peak_powers)
        return heart_rates[max_idx], peak_powers[max_idx]
    return None, None

def calculate_heart_rate(filename):
    json_filename = filename.replace('.', '') + '.json'
    data = get_color_forhead_signals(filename, json_filename)
    # print(f'{total_frames}, {duration_seconds}, {frame_rate}')
    frame_rate = 30.0
    with open(json_filename, 'r') as json_file:
        data = json.load(json_file)

    data = [d for d in data if d != None]

    signal_g = [sig[1] for sig in data]
    signal_r = [sig[2] for sig in data]
    signal_b = [sig[0] for sig in data]


    all_data = [r + g for r, (g, b) in zip(signal_r, zip(signal_g, signal_b))]
    all_data = preprocess_signal(all_data)

    num_samples = len(all_data)//1
    data_split = []
    for i in range(0, len(all_data) - num_samples + 1, num_samples):
        a = all_data[i: i+num_samples]
        data_split.append(a)
    best_guess = []
    for split in data_split:
            piece = np.array(split, dtype=np.float64)
            if np.isnan(piece).any():
                piece = np.nan_to_num(piece, nan=200.0)

            fourier_transform = np.abs(fft(piece))
            num_frames = len(fourier_transform)
            bpm, _ = find_heart_rate(fourier_transform, frame_rate, num_frames)
            return bpm


# if __name__ == "__main__":
#     filename = 'output.mov'
#     calculate_heart_rate(filename)