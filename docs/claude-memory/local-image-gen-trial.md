---
name: local-image-gen-trial
description: "Kết quả thử tạo ảnh trên máy bằng stable-diffusion.cpp Vulkan ngày 2026-11-02; SDXL hết RAM, DreamShaper 8 đạt tiêu chí"
metadata:
  node_type: memory
  type: project
  originSessionId: c1d14641-10f1-486f-8366-4fb730d1ee5d
  modified: 2026-11-02T07:42:17.909Z
---

**DreamShaper 8 đạt tiêu chí** (`.tools/sdcpp/models/DreamShaper_8_pruned.safetensors`, script `.tools/sdcpp/test/run_sd15.ps1`, 512 px, 20 bước, dpm++2m karras, cfg 7): 62 giây một ảnh, RAM trống giảm từ 6,4 xuống 2,5 GB, bộ nhớ cam kết cao nhất 5,4 GB. Ảnh sân thượng đẹp nhưng lệch prompt: nhiều sao hơn yêu cầu, thêm đèn lồng, ghế gỗ thay ghế nhựa, không có bồn nước. Chưa thử phóng to và chưa thử cảnh khó (tay cầm điện thoại, đông người).

**SDXL fp16 trên sd.cpp không dùng được:** RAM trống 4,6 GB thì sau 12 giây còn 0,1 GB, chưa ra ảnh, và log ghi `(0 / 2364) LoRA tensors have been applied`. LoRA LCM của `latent-consistency/lcm-lora-sdv15` trả về 401 nên chưa dùng.

**Why:** tạo ảnh là khâu nặng máy nhất; tiêu chí đã thống nhất là dưới khoảng 2 phút mỗi ảnh và dưới khoảng 8 GB RAM.

**Cách viết prompt cho model này** (rút ra ngày 2026-11-02): prompt dài và có từ tả dáng người ("slim", "graceful", "body proportions") cho ra cảnh ban ngày và ảnh kiểu người mẫu quay mặt lại, phong cách bị mất. Prompt ngắn, đưa "night scene" và phong cách lên đầu, nhân vật nhỏ trong khung, mặc hoodie, nhìn từ sau thì đúng cảnh đêm và đúng phong cách. Phấn màu (`v3-phanmau-11.png` trong `.tools/sdcpp/test`) là kiểu đẹp nhất trong các lượt thử trên máy, nhưng người dùng đã bỏ nó khi chuyển sang Flow, xem [[series-thanh-pho-khong-sao]]. Model vẫn vẽ nhà cao tầng thay vì nhà cũ Việt Nam và nhiều sao hơn yêu cầu.

**How to apply:** ưu tiên DreamShaper 8 cho cảnh đơn giản, Google Flow cho cảnh mà model này làm hỏng. Prompt Flow hiện có không dùng lại nguyên văn được, phải viết ngắn theo cách trên. Xem thêm [[session-roles]] và [[video-build-pitfalls]].
