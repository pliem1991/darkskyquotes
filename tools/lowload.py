"""Giữ máy dùng được khi đang dựng: hạ độ ưu tiên và giới hạn số luồng. Import trước numpy/torch."""
import ctypes
import os
import sys
from ctypes import wintypes

THREADS = "4"
for name in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(name, THREADS)

if sys.platform == "win32":
    BELOW_NORMAL_PRIORITY_CLASS = 0x4000
    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    kernel32.GetCurrentProcess.restype = wintypes.HANDLE
    kernel32.SetPriorityClass.argtypes = [wintypes.HANDLE, wintypes.DWORD]
    kernel32.SetPriorityClass(kernel32.GetCurrentProcess(), BELOW_NORMAL_PRIORITY_CLASS)
