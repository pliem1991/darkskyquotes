import json
V={"duyen":{"preset":"Mỹ Duyên","pitch":1.0,"tempo":1.17,"af":"highpass=f=110,equalizer=f=300:t=q:w=1:g=-1.5,equalizer=f=3500:t=q:w=1.2:g=2,equalizer=f=6500:t=q:w=1:g=2,acompressor=threshold=-22dB:ratio=2:attack=15:release=200:makeup=2,loudnorm=I=-15:TP=-1.5:LRA=9"}}
L=[
("c1_duyen","c1",["Quên điện thoại ở nhà một ngày,","bạn trụ được tới mấy giờ?"],0.3,[0.1]),
("c2_duyen","c2",["Bảy giờ sáng chạy nửa đường mới nhớ quên máy,","quay về thì trễ,","nên đi làm luôn."],0.3,[0.08,0.06]),
("c3_duyen","c3",["Ghé tiệm bánh mì,","trong ví còn đúng mười ngàn,","ổ bánh mì giờ hai mươi lăm."],0.3,[0.08,0.12]),
("c4_duyen","c4",["Tới công ty mới biết phòng họp đổi giờ,","thông báo nằm trong nhóm Zalo."],0.3,[0.1]),
("c5_duyen","c5",["Trưa mượn máy đồng nghiệp gọi về nhà,","mới thấy mình không thuộc số của ai,","kể cả số của má."],0.35,[0.08,0.15]),
("c6_duyen","c6",["Ba giờ chiều thì chịu thua,","tay cứ tự sờ vô túi xách mười mấy lần."],0.3,[0.1]),
("c7_duyen","c7",["Tối về mở máy,","ba chục tin nhắn,","tin nào cũng hỏi có chuyện gì không."],1.5,[0.1,0.1]),
]
lines=[]
for f,s,p,pause,ip in L:
    lines.append({"file":f,"voice":"duyen","text":" ".join(p),"parts":p,"tempo":1.0,"scene":s,"pause":pause,"inner_pauses":[{"after_part":i,"sec":x} for i,x in enumerate(ip)]})
json.dump({"voices":V,"lead_in":0.05,"lines":lines},open("voices.json","w",encoding="utf-8"),ensure_ascii=False,indent=1)
