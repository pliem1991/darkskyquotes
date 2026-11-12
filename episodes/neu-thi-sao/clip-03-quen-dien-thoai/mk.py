import json
V={"minh":{"preset":"Thiền Tâm Đức","pitch":1.0,"tempo":1.19,"af":"highpass=f=110,equalizer=f=300:t=q:w=1:g=-1.5,equalizer=f=3500:t=q:w=1.2:g=2,equalizer=f=6500:t=q:w=1:g=2,acompressor=threshold=-22dB:ratio=2:attack=15:release=200:makeup=2,loudnorm=I=-15:TP=-1.5:LRA=9"}}
L=[
("c1_minh","c1-dien-thoai-tren-giuong",["Quên điện thoại ở nhà một ngày,","bạn trụ được tới mấy giờ?"],0.45,[0.15]),
("c2_minh","c2-nua-duong",["Bảy giờ sáng chạy nửa đường mới nhớ quên máy,","quay về thì trễ,","nên đi làm luôn."],0.4,[0.15,0.1]),
("c3_minh","c3-banh-mi",["Ghé tiệm bánh mì,","trong ví còn đúng mười ngàn,","ổ bánh mì giờ hai mươi lăm."],0.4,[0.15,0.2]),
("c4_minh","c4-phong-hop",["Tới công ty mới biết phòng họp đổi giờ,","thông báo nằm trong nhóm Zalo."],0.4,[0.15]),
("c5_minh","c5-muon-may",["Trưa mượn máy đồng nghiệp gọi về nhà,","mới thấy mình không thuộc số của ai,","kể cả số của má."],0.5,[0.15,0.2]),
("c6_minh","c6-so-tui-quan",["Ba giờ chiều thì chịu thua,","tay cứ tự sờ vô túi quần mười mấy lần."],0.4,[0.15]),
("c7_minh","c7-ba-chuc-tin",["Tối về mở máy,","ba chục tin nhắn,","tin nào cũng hỏi có chuyện gì không."],4.8,[0.15,0.15]),
]
lines=[]
for f,s,p,pause,ip in L:
    lines.append({"file":f,"voice":"minh","text":" ".join(p),"parts":p,"tempo":1.0,"scene":s,"pause":pause,"inner_pauses":[{"after_part":i,"sec":x} for i,x in enumerate(ip)]})
json.dump({"voices":V,"lead_in":0.05,"lines":lines},open("voices.json","w",encoding="utf-8"),ensure_ascii=False,indent=1)
