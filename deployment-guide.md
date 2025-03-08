# دليل نشر وتشغيل نظام إدارة الرواتب

## متطلبات النظام

- Node.js (الإصدار 16 أو أحدث)
- npm (مدير حزم Node.js)
- متصفح حديث (Chrome, Firefox, Edge, Safari)

## خطوات النشر على جهاز واحد

### 1. تثبيت Node.js

1. قم بتحميل وتثبيت Node.js من الموقع الرسمي: https://nodejs.org/
2. تأكد من تثبيت Node.js بنجاح عن طريق فتح موجه الأوامر (Command Prompt) وكتابة:
   ```
   node -v
   npm -v
   ```

### 2. تحميل وإعداد التطبيق

1. قم بتحميل ملفات التطبيق من المصدر المقدم لك (ملف مضغوط أو مستودع Git)
2. استخرج الملفات إلى مجلد على جهازك (مثلاً: `C:\salary-system` أو `/home/user/salary-system`)
3. افتح موجه الأوامر وانتقل إلى مجلد التطبيق:
   ```
   cd مسار_المجلد
   ```
4. قم بتثبيت اعتماديات التطبيق:
   ```
   npm install
   ```

### 3. بناء التطبيق للإنتاج

1. قم ببناء نسخة الإنتاج من التطبيق:
   ```
   npm run build
   ```
2. بعد اكتمال عملية البناء، ستجد مجلد `dist` يحتوي على ملفات التطبيق الجاهزة للنشر.

### 4. تشغيل التطبيق

#### الطريقة 1: استخدام خادم تطوير Vite

1. لتشغيل التطبيق في بيئة التطوير:
   ```
   npm run dev
   ```
2. سيتم فتح التطبيق تلقائياً في المتصفح على العنوان: `http://localhost:5173`

#### الطريقة 2: استخدام خادم ثابت

1. قم بتثبيت حزمة `serve` العالمية:
   ```
   npm install -g serve
   ```
2. قم بتشغيل الخادم الثابت لمجلد `dist`:
   ```
   serve -s dist
   ```
3. سيتم تشغيل التطبيق على العنوان: `http://localhost:3000`

## نشر التطبيق على شبكة محلية

لجعل التطبيق متاحاً لجميع الأجهزة على الشبكة المحلية:

### 1. معرفة عنوان IP للخادم

1. افتح موجه الأوامر واكتب:
   - في Windows: `ipconfig`
   - في Linux/Mac: `ifconfig` أو `ip addr`
2. ابحث عن عنوان IPv4 للشبكة المحلية (عادة يبدأ بـ 192.168.x.x أو 10.x.x.x)

### 2. تشغيل التطبيق مع تحديد عنوان الاستماع

#### باستخدام Vite (للتطوير)

1. قم بتعديل ملف `package.json` وأضف سطر جديد في قسم `scripts`:
   ```json
   "dev:network": "vite --host"
   ```
2. قم بتشغيل الأمر:
   ```
   npm run dev:network
   ```
3. سيكون التطبيق متاحاً على عنوان IP الخاص بالخادم: `http://your-ip-address:5173`

#### باستخدام خادم ثابت (للإنتاج)

1. قم بتشغيل الخادم الثابت مع تحديد عنوان الاستماع:
   ```
   serve -s dist -l tcp://0.0.0.0:3000
   ```
2. سيكون التطبيق متاحاً على عنوان IP الخاص بالخادم: `http://your-ip-address:3000`

## إنشاء اختصار لتشغيل التطبيق

### في Windows

1. أنشئ ملف نصي جديد بامتداد `.bat` (مثلاً: `start-salary-system.bat`)
2. أضف الأوامر التالية إلى الملف:
   ```batch
   @echo off
   cd /d مسار_مجلد_التطبيق
   echo Starting Salary Management System...
   serve -s dist -l tcp://0.0.0.0:3000
   ```
3. احفظ الملف وأنشئ اختصاراً له على سطح المكتب

### في Linux/Mac

1. أنشئ ملف نصي جديد (مثلاً: `start-salary-system.sh`)
2. أضف الأوامر التالية إلى الملف:
   ```bash
   #!/bin/bash
   cd مسار_مجلد_التطبيق
   echo "Starting Salary Management System..."
   serve -s dist -l tcp://0.0.0.0:3000
   ```
3. اجعل الملف قابلاً للتنفيذ:
   ```
   chmod +x start-salary-system.sh
   ```
4. أنشئ اختصاراً للملف على سطح المكتب

## تثبيت التطبيق كخدمة نظام (للخوادم)

### في Windows (باستخدام NSSM)

1. قم بتحميل وتثبيت NSSM (Non-Sucking Service Manager) من: https://nssm.cc/
2. افتح موجه الأوامر كمسؤول وقم بتشغيل:
   ```
   nssm install SalarySystem
   ```
3. في النافذة التي ستظهر، قم بتعيين:
   - Path: مسار Node.js (عادة `C:\Program Files\nodejs\node.exe`)
   - Startup directory: مجلد التطبيق
   - Arguments: مسار ملف الخادم (مثلاً: `C:\path\to\serve.cmd -s dist -l tcp://0.0.0.0:3000`)
4. انقر على "Install service"
5. لبدء تشغيل الخدمة:
   ```
   nssm start SalarySystem
   ```

### في Linux (باستخدام systemd)

1. أنشئ ملف خدمة جديد:
   ```
   sudo nano /etc/systemd/system/salary-system.service
   ```
2. أضف المحتوى التالي:
   ```
   [Unit]
   Description=Salary Management System
   After=network.target

   [Service]
   Type=simple
   User=your_username
   WorkingDirectory=/path/to/app
   ExecStart=/usr/bin/serve -s dist -l tcp://0.0.0.0:3000
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```
3. قم بتحديث systemd وتشغيل الخدمة:
   ```
   sudo systemctl daemon-reload
   sudo systemctl enable salary-system
   sudo systemctl start salary-system
   ```

## ملاحظات هامة

1. **البيانات المحلية**: يستخدم التطبيق localStorage لتخزين البيانات، مما يعني أن البيانات ستكون مخزنة في متصفح المستخدم. إذا كنت تريد مشاركة البيانات بين عدة مستخدمين، فستحتاج إلى تكوين قاعدة بيانات Supabase.

2. **الأمان**: إذا كنت تستخدم التطبيق في بيئة إنتاجية، فكر في إضافة طبقة أمان مثل استخدام HTTPS أو إعداد جدار حماية للشبكة.

3. **النسخ الاحتياطي**: قم بعمل نسخ احتياطية منتظمة للبيانات باستخدام ميزة النسخ الاحتياطي المدمجة في التطبيق.

4. **التحديثات**: تحقق بانتظام من وجود تحديثات للتطبيق وقم بتطبيقها للحصول على أحدث الميزات وإصلاحات الأمان.

## الدعم الفني

إذا واجهت أي مشاكل أو كانت لديك استفسارات، يرجى التواصل مع فريق الدعم الفني.
