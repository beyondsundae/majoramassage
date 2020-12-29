
  
# Introduction

**(TH)** Web Application นี้เกิดขึ้นจากการที่ สมัยผมตอนปี 1 ในมหาลัย ผมได้บังเอิญไปเจอเว็บบริการร้านนวด ทำให้ผมรู้สึกสงสัยและประหลาดใจมากที่มีเว็บแบบนี้บนอินเตอร์เน็ต ผมได้เก็บมาคิดตลอดว่า มันเป็นเว็บที่แปลกและน่าสนใจดี ถ้ามีโอกาสก็จะลองศึกษาระบบและลองทำตามดู จนในปัจจุบัน ผมที่กำลังศึกษาการเขียนเว็บได้ประมานหนึ่ง ตัดสินใจที่จะสร้างเว็บนี้ เพื่อเป็นการศึกษาและพัฒนาความรู้ประสบการณ์ระหว่างทางให้มากยิ่งขึ้น

**(EN)** This Web Application has arisen when I was a first-year student. While I surfing the internet and I found a weird website. It's a Massage booking web ( a Massage including s3x ) so I think it's strange and keep thinking about this kind of web until now. Now, I'm studying web development so I decided to made this web to study massage booking system.
  ___
**(TH)** **น้อง-นวบ-นาบ.**  เป็น Web Application ที่ให้ลูกค้าสามารถเข้ามาจองนัดวันเวลาเพื่อมาใช้บริการนวดกับน้องๆ ทางร้านได้ และเมื่อลูกค้าใช้บริการเสร็จ สามารถรีวิว feedback เป็นคะแนนให้กับน้องๆหมอนวดได้ ( จองนัด - ชำระเงินที่เคาเตอร์ - เข้าใช้บริการ )

**(EN)** **Nong-Nuab-Naab.**  A web application that the user can book and go for a massage at a massage parlor (assume). After done massage user can review and give a rating. ( Booking - Pay - Get massage )

## Features
**(TH)**
-**สมัครสมาชิก**
-**เข้าสู่ระบบ**
-**ลืมรหัสผ่าน**
-**สามารถเข้าดูข้อมูลของน้องๆ ได้**

-**ฝั่งลูกค้า**
|__ สามารถกดถูกใจ ( Favorite )
|__ สามารถเข้าดูข้อมูลของน้องๆ ได้
|__  สามารถกดเลือก วันที่ และ เวลา เพื่อจองนัดได้ ( ถ้าวันไหนน้องๆ มีคิวแล้วจะไม่สามารถเลือกได้ )
|__ สามารถดูรายการการนัดได้ ( รายการที่ รอยืนยัน/ สำเร็จ /ยกเลิก )
|__  สามารถยกเลิกการนัดได้
|__ สามารถรีวิวหลังการใช้บริการเสร็จแล้วได้ ( ให้ดาว / แสดงความคิดเห็น )
|__ สามารถดูคะแนนที่เคยรีวิวไปแล้วได้
|__ สามารถเปลี่ยนรูปประจำตัวได้
|__ สามารถเปลี่ยนชื่อได้

-**ฝั่งน้องๆหมอนวด**
|__ สามารถเข้าดูข้อมูลของน้องๆ ได้
|__ สามารถดูรายการการนัดได้ ( รายการที่ รอยืนยัน/ สำเร็จ /ยกเลิก )
|__ สามารถ ตกลง หรือ ยกเลิก การนัดได้
|__ สามารถดูคะแนนที่ลูกค้าเคยรีวิวไปแล้วได้
|__ สามารถเปลี่ยนรูปประจำตัวได้  
|__ สามารถเปลี่ยนชื่อได้
|__ สามารถเปลี่ยนอายุได้
|__ สามารถเพิ่ม/ ลดรายการนวดได้

**(EN)** 
-**Register**
-**Login**
-**Forgot Password**
-**Chiropractor information**

-**Member customer side**
|__ Like and Unlike Chiropator.
|__ Click to see each chiropractor's information.
|__ Pick Date and time to book. (  Option will disable if that date and time are already booked )  
|__ User can see their own booking. ( Booking status: NotDone/ Done/ Reject )
|__  User can cancel booking.
|__ User can review and give a rating after done massage.
|__ User can see their own reviews.
|__ User can change profile picture.
|__ User can change their name.

-**Chiropator side**
|__ Click to see each chiropractor's information.
|__ Chiropractor can see their own booking. ( Booking status: NotDone/ Done/ Reject )
|__ Chiropractor can accept or cancel booking.
|__ Chiropractor can see what member customer reviews to you. 
|__ Chiropractor can change profile picture.
|__ Chiropractor can change their name.
|__  Chiropractor can change their age.
|__  Chiropractor can Add/Sub massage list .

## Future work
**(TH)**
- เปลี่ยนรหัสผ่านได้ในหน้าโปรไฟล์
- Pagination/ Infinite Scroll สำหรับหน้าแรก
- น้องสามารถลงรูปได้หลายรูป เพื่อเพิ่มการตัดสินใจให้กับลูกค้า
- ระบบหลังบ้าน ( สำหรับแอดมินใช้สำหรับ แก้ไขข้อมูลได้โดยที่ไม่ต้องเข้าไปแก้ใน Firebase โดยตรง )
- การยืนยันอีเมล
- captcha กันการสแปม
- แก้ไขรหัสลับในการสมัครเป็นน้องๆ
- บันทึกรูปและชื่อลงในแต่ละคิว ( ตอนนี้ยังไม่มีการบันทึกชื่อและรูปลงไปในการ Booking  ทำให้เมื่อเปลี่ยนรูปโปรไฟล์ URL รูปในคิวที่เคยไปใช้บริการก็จะเปลี่ยนไป  )
- เอาการจองออก  สำหรับบัญชีของน้องๆ ที่เข้าไปดูข้อมูลของน้องๆ
- เพิ่มภาษาอังกฤษ

**(EN)** 
- Changing password in a profile page.
- Pagination/ Infinite Scroll for home page.
- Chiropractor can upload multiple pictures to album.
- Back Office. ( for admin can edit information by not need to firebase website directly )
- Email Confirmation.
- Adding captcha.
- Change secret code feature when want to register as chiropractor.
- Save picture and name to each booking. ( when change name or picture, Url also changed. But the picture and name in booking is not change accordingly )
-  Remove picking date and time for chiropractor side.
- Add English language.


# Used in App:


 - **React Hook**
	 |___ useContext
 - **Firebase**
     |___ Authentication
     |___Firestore
     |___Storage
     |___Hosting & Deploy 
 - **React-Router**
 - **Deployment**
  ___
 - **Ant-Design**
 -  **Lodash**
 -  **React-Easy-Crop**
 -  **Material-UI (Rate)**
 - **window.addEventListener**

# Overview

## Desktop
**Not Logged in**

![ezgif com-gif-maker](https://user-images.githubusercontent.com/59742129/103274470-54e3df80-49f4-11eb-9c24-33ec55086e9a.gif)
**Figure 1.1** Homepage.

![ezgif com-gif-maker (1)](https://user-images.githubusercontent.com/59742129/103274690-d6d40880-49f4-11eb-8377-9274693130a5.gif)
**Figure 1.2** Chiropractor information. ( not logged in, can't pick data and time  )

![ezgif com-gif-maker (2)](https://user-images.githubusercontent.com/59742129/103274961-9032de00-49f5-11eb-9bab-e24f3bf448e7.gif)
**Figure 1.3** Login, Register and Forgot Password page.

**Logged in**

![ezgif com-gif-maker (3)](https://user-images.githubusercontent.com/59742129/103276097-3bdd2d80-49f8-11eb-99ec-04bfbbad50c3.gif)
**Figure 1.4** After logged in user can like and unlike.

![ezgif com-gif-maker (4)](https://user-images.githubusercontent.com/59742129/103276466-33392700-49f9-11eb-8967-9e768ec3f458.gif)
**Figure 1.5** user pick date and time ( Option will disable if that date and time are already booked ) and badge showing a number of queue.

![ezgif com-gif-maker (5)](https://user-images.githubusercontent.com/59742129/103276654-b5295000-49f9-11eb-8c7d-81fcdce5ac5f.gif)
**Figure 1.6** Booking page showing list of queue that you picked. ( Member side )

![ezgif com-gif-maker (6)](https://user-images.githubusercontent.com/59742129/103276855-34b71f00-49fa-11eb-9b37-3b03dac654ce.gif)
**Figure 1.7** Booking page showing list of queue that member picked and showing accept the book but chiropractor cannot see her score until user give a review. ( Chiropractor side )

![ezgif com-gif-maker (7)](https://user-images.githubusercontent.com/59742129/103277117-db9bbb00-49fa-11eb-93bd-76d1ef7572ff.gif)
**Figure 1.8** After chiropractor's accepted, user can give a review including score and comment box that limit the text by 100 characters . ( Member side )

![ezgif com-gif-maker (8)](https://user-images.githubusercontent.com/59742129/103277420-857b4780-49fb-11eb-8d87-cfd47f9f3de7.gif)
**Figure 1.9** After user review, Chiropractor can see what member customer reviews to you. ( Chiropractor side )

![ezgif com-gif-maker (11)](https://user-images.githubusercontent.com/59742129/103277958-dd667e00-49fc-11eb-8dfc-4117a506ba49.gif)
**Figure 1.10** Then, recently comment showing in the review zone. 

![ezgif com-gif-maker (9)](https://user-images.githubusercontent.com/59742129/103277638-181be680-49fc-11eb-8990-04c527b7b277.gif)
**Figure 1.11** Changing profile picture and name features. ( Member side )

![ezgif com-gif-maker (10)](https://user-images.githubusercontent.com/59742129/103277797-67faad80-49fc-11eb-8cd5-68f874441609.gif)
**Figure 1.12** Changing profile picture, name, age, and Add/ Sub massage list features. ( Chiropractor side )

![ezgif com-gif-maker (12)](https://user-images.githubusercontent.com/59742129/103278177-72697700-49fd-11eb-96a8-462f6a08fc86.gif)
**Figure 1.13** After logged out, favorite button disappear.

## Mobile

![ezgif com-gif-maker (13)](https://user-images.githubusercontent.com/59742129/103278453-18b57c80-49fe-11eb-9f3e-86e5e82f7db0.gif)
**Figure 1.14** Homepage.     

![ezgif com-gif-maker (14)](https://user-images.githubusercontent.com/59742129/103278547-531f1980-49fe-11eb-927e-020149d67ff2.gif)
**Figure 1.15** Chiropractor information. ( not logged in, can't pick data and time  )     

![ezgif com-gif-maker (16)](https://user-images.githubusercontent.com/59742129/103278675-a98c5800-49fe-11eb-9b82-ba2db8295a30.gif)
**Figure 1.16** After logged in user can like and unlike.     

![ezgif com-gif-maker (18)](https://user-images.githubusercontent.com/59742129/103278865-143d9380-49ff-11eb-81ee-85fdaa829e6b.gif)
**Figure 1.17** user pick date and time ( Option will disable if that date and time are already booked ) and badge showing a number of queue.     

![ezgif com-gif-maker (19)](https://user-images.githubusercontent.com/59742129/103278958-4e0e9a00-49ff-11eb-9e10-2a098df85ab4.gif)
**Figure 1.16** Booking page showing list of queue that member picked and showing accept the book but chiropractor cannot see her score until user give a review. ( Chiropractor side )    


![ezgif com-gif-maker (20)](https://user-images.githubusercontent.com/59742129/103279070-94fc8f80-49ff-11eb-8dca-90609efe9de6.gif)
**Figure 1.19** After user review, Chiropractor can see what member customer reviews to you. ( Chiropractor side )

![ezgif com-gif-maker (21)](https://user-images.githubusercontent.com/59742129/103279187-d5f4a400-49ff-11eb-99ac-c2e19412adf1.gif)
**Figure 1.20** Changing profile picture, name, age, and Add/ Sub massage list features. ( Chiropractor side )    

![ezgif com-gif-maker (22)](https://user-images.githubusercontent.com/59742129/103279276-fd4b7100-49ff-11eb-9fbe-f28fd607b76d.gif)
**Figure 1.21** After logged out, favorite button disappear.

# Demo
[Vercel](https://majoramassage.vercel.app/)
[Netlify](https://5fea14715f36e000080a7607--vigilant-kirch-c05bec.netlify.app/)
[Firebase](https://majoramassage.web.app/)

# How to use

**Terminal**

    npm install
    npm start

# About
**By beyondsundae (Thanakrit)**[![Beyondsundae](https://avatars2.githubusercontent.com/u/59742129?s=60&v=4)](https://github.com/beyondsundae)  
**May the knowledge and Intention be with you ❤️**
