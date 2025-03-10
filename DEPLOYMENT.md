# نظام إدارة الرواتب - دليل النشر والتشغيل

## متطلبات النظام

- Node.js (الإصدار 16 أو أحدث)
- NPM (الإصدار 8 أو أحدث)
- متصفح حديث (Chrome، Firefox، Edge، Safari)

## خيارات النشر

### 1. التشغيل المحلي (للاستخدام اليومي)

هذه الطريقة مناسبة للاستخدام اليومي على جهاز واحد أو شبكة محلية صغيرة.

#### الخطوات:

1. قم بتثبيت Node.js من [الموقع الرسمي](https://nodejs.org/)
2. استخرج ملفات التطبيق إلى المجلد المطلوب
3. افتح موجه الأوامر (Command Prompt) أو Terminal
4. انتقل إلى مجلد التطبيق
5. قم بتشغيل الأمر التالي لتثبيت المكتبات المطلوبة (مرة واحدة فقط):
   ```
   npm install
   ```
6. لتشغيل التطبيق، استخدم أحد الخيارات التالية:

   **في نظام Windows:**
   - انقر نقرًا مزدوجًا على ملف `start-app.bat`
   
   **في نظام macOS أو Linux:**
   - افتح Terminal وانتقل إلى مجلد التطبيق
   - قم بتنفيذ الأمر: `chmod +x start-app.sh` (مرة واحدة فقط)
   - ثم قم بتنفيذ: `./start-app.sh`

   **باستخدام الأوامر مباشرة:**
   ```
   npm run build
   npm run preview
   ```

7. سيتم فتح التطبيق تلقائيًا في المتصفح على العنوان: `http://localhost:4173`

### 2. النشر على خادم ويب

هذه الطريقة مناسبة للاستخدام المؤسسي عبر شبكة الإنترنت أو الإنترانت.

#### الخطوات:

1. قم ببناء نسخة الإنتاج من التطبيق:
   ```
   npm run build
   ```

2. ستجد الملفات الناتجة في مجلد `dist`

3. قم برفع محتويات مجلد `dist` إلى خادم الويب الخاص بك

4. قم بتكوين خادم الويب لتوجيه جميع الطلبات إلى `index.html`

   **مثال لتكوين Nginx:**
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;
     root /path/to/dist;
     index index.html;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

## مزامنة البيانات بين العملاء

يستخدم النظام آليتين للمزامنة:

1. **التخزين المحلي (localStorage)**: يتم تخزين البيانات محليًا في متصفح كل مستخدم

2. **قاعدة بيانات Supabase**: إذا تم تكوين Supabase، سيقوم النظام تلقائيًا بمزامنة البيانات مع قاعدة البيانات المركزية

### إعداد Supabase للمزامنة المركزية

لضمان مزامنة البيانات بين جميع العملاء، يوصى بإعداد Supabase:

1. قم بإنشاء حساب على [Supabase](https://supabase.com/)
2. قم بإنشاء مشروع جديد
3. قم بتشغيل ملفات الترحيل الموجودة في مجلد `supabase/migrations`
4. قم بتعديل ملف `.env` وإضافة بيانات الاتصال:

   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. أعد بناء التطبيق ونشره

## النسخ الاحتياطي واستعادة البيانات

### إنشاء نسخة احتياطية

1. قم بتسجيل الدخول إلى النظام كمدير
2. انتقل إلى الإعدادات > النسخ الاحتياطي
3. انقر على زر "تصدير البيانات"
4. سيتم تنزيل ملف JSON يحتوي على جميع بيانات النظام

### استعادة البيانات

1. قم بتسجيل الدخول إلى النظام كمدير
2. انتقل إلى الإعدادات > النسخ الاحتياطي
3. انقر على زر "استيراد البيانات"
4. اختر ملف النسخة الاحتياطية
5. انقر على "استيراد البيانات"

## اختبار النظام

للتحقق من جاهزية النظام:

1. قم بتسجيل الدخول إلى النظام
2. انتقل إلى رابط `/system-check`
3. سيقوم النظام بإجراء اختبارات شاملة وعرض النتائج

## استكشاف الأخطاء وإصلاحها

### مشاكل تسجيل الدخول

- تأكد من استخدام بيانات تسجيل الدخول الصحيحة
- الحسابات الافتراضية:
  - مدير: admin@example.com / password123
  - محاسب: accountant@example.com / password123

### مشاكل المزامنة

- تحقق من اتصال الإنترنت
- تأكد من صحة بيانات اتصال Supabase في ملف `.env`
- يمكن استخدام صفحة اختبار الاتصال للتحقق من الاتصال بقاعدة البيانات

### مشاكل أخرى

- قم بمسح ذاكرة التخزين المؤقت للمتصفح
- تأكد من استخدام أحدث إصدار من المتصفح
- تحقق من سجلات وحدة التحكم في المتصفح (F12) للحصول على رسائل الخطأ
