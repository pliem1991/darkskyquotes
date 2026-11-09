import sys; sys.path.insert(0, r"D:\AI\Tiktok\darkskyquotes\tools")
import lowload  # noqa
import numpy as np, torch, cv2
from PIL import Image
from torchvision.models.segmentation import deeplabv3_resnet101, DeepLabV3_ResNet101_Weights
torch.set_num_threads(4)
img = Image.open("goc.jpg").convert("RGB")
w = DeepLabV3_ResNet101_Weights.DEFAULT
m = deeplabv3_resnet101(weights=w).eval()
x = w.transforms()(img).unsqueeze(0)
with torch.no_grad():
    out = m(x)["out"][0]
prob = torch.softmax(out, 0)
person = prob[15].numpy()  # VOC person
person = cv2.resize(person, img.size, interpolation=cv2.INTER_LINEAR)
Image.fromarray((person * 255).astype(np.uint8)).save("mask_person_raw.png")
print("ok", person.mean())
