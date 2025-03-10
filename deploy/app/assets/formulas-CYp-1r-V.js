import{b as g,u as S,r as t,j as e,B as m,a7 as C,C as h,L as d,a3 as F}from"./index-DCzl8a2M.js";import{T as s}from"./textarea-CQHQAEMr.js";import{R}from"./refresh-cw-B6-TPpno.js";import{S as w}from"./save-CuLUMJM-.js";function P(){const{hasPermission:j}=g(),{toast:c}=S(),[o,l]=t.useState("baseSalary + monthlyIncentives + bonuses + overtime"),[n,i]=t.useState("absences * dailyRate + penalties + advances + purchases"),[f,r]=t.useState("totalSalary - totalDeductions"),[p,b]=t.useState("baseSalary / workingDays"),[u,x]=t.useState("overtimeHours * (dailyRate / 8) * 1.5"),v=[{name:"baseSalary",description:"الراتب الأساسي للموظف"},{name:"monthlyIncentives",description:"الحوافز الشهرية"},{name:"bonuses",description:"المكافآت"},{name:"overtime",description:"قيمة الأوفرتايم"},{name:"overtimeHours",description:"عدد ساعات الأوفرتايم"},{name:"absences",description:"عدد أيام الغياب"},{name:"penalties",description:"قيمة الجزاءات"},{name:"advances",description:"قيمة السلف"},{name:"purchases",description:"قيمة المشتريات"},{name:"dailyRate",description:"قيمة اليوم الواحد"},{name:"workingDays",description:"عدد أيام العمل في الشهر (عادة 30 يوم)"},{name:"totalSalary",description:"إجمالي الراتب"},{name:"totalDeductions",description:"إجمالي الخصومات"}],y=()=>{const a={salaryFormula:o,deductionsFormula:n,netSalaryFormula:f,dailyRateFormula:p,overtimeFormula:u};localStorage.setItem("salary_formulas",JSON.stringify(a)),c({title:"تم الحفظ بنجاح",description:"تم حفظ معادلات الرواتب بنجاح"})},N=()=>{l("baseSalary + monthlyIncentives + bonuses + overtime"),i("absences * dailyRate + penalties + advances + purchases"),r("totalSalary - totalDeductions"),b("baseSalary / workingDays"),x("overtimeHours * (dailyRate / 8) * 1.5"),c({title:"تم إعادة التعيين",description:"تم إعادة تعيين معادلات الرواتب إلى القيم الافتراضية"})};return j("manage_settings")?e.jsxs("div",{className:"space-y-6 tempo-1200eedc-3591-55bf-a9b6-ea4eec2a5772",dir:"rtl",tempoelementid:"tempo-1200eedc-3591-55bf-a9b6-ea4eec2a5772",children:[e.jsx(C,{title:"معادلات الرواتب",description:"تعديل معادلات حساب الرواتب والخصومات",actions:e.jsxs(e.Fragment,{children:[e.jsxs(m,{variant:"outline",onClick:N,children:[e.jsx(R,{className:"ml-2 h-4 w-4"}),"إعادة تعيين"]}),e.jsxs(m,{onClick:y,children:[e.jsx(w,{className:"ml-2 h-4 w-4"}),"حفظ"]})]}),className:"tempo-fe16ee95-ce06-5193-acd4-db984804ac0a ",tempoelementid:"tempo-fe16ee95-ce06-5193-acd4-db984804ac0a"}),e.jsx(h,{className:"p-6 tempo-72dc8ee5-8d6e-5562-88dd-555228dcb522",tempoelementid:"tempo-72dc8ee5-8d6e-5562-88dd-555228dcb522",children:e.jsxs("div",{className:"space-y-6 tempo-f20d2459-8ff2-5eb4-aeff-325540ce0e6e",tempoelementid:"tempo-f20d2459-8ff2-5eb4-aeff-325540ce0e6e",children:[e.jsxs("div",{className:"space-y-2 tempo-55716058-f120-5fd6-b346-6550196f61bd",tempoelementid:"tempo-55716058-f120-5fd6-b346-6550196f61bd",children:[e.jsx(d,{className:"tempo-bbb5d631-d470-5120-8d45-c8cfdc8334e2 ",tempoelementid:"tempo-bbb5d631-d470-5120-8d45-c8cfdc8334e2",children:"معادلة إجمالي الراتب"}),e.jsx(s,{value:o,onChange:a=>l(a.target.value),className:"font-mono text-right tempo-21d61e0f-b105-56b9-b350-b42246a2a69f",dir:"ltr",tempoelementid:"tempo-21d61e0f-b105-56b9-b350-b42246a2a69f"})]},"164772729519493184037695747758969170035-9"),e.jsxs("div",{className:"space-y-2 tempo-f3086674-e58f-589f-8f17-fd7cd34572b5",tempoelementid:"tempo-f3086674-e58f-589f-8f17-fd7cd34572b5",children:[e.jsx(d,{className:"tempo-cf9fd9ad-c21b-5287-b389-39413337e70c ",tempoelementid:"tempo-cf9fd9ad-c21b-5287-b389-39413337e70c",children:"معادلة إجمالي الخصومات"}),e.jsx(s,{value:n,onChange:a=>i(a.target.value),className:"font-mono text-right tempo-fde779fd-4e48-532e-9035-2a50e64031df",dir:"ltr",tempoelementid:"tempo-fde779fd-4e48-532e-9035-2a50e64031df"})]},"164772729519493184037695747758969170035-12"),e.jsxs("div",{className:"space-y-2 tempo-4b24d052-29aa-5694-a6a4-70a9aca264da",tempoelementid:"tempo-4b24d052-29aa-5694-a6a4-70a9aca264da",children:[e.jsx(d,{className:"tempo-a25f4c52-2937-5c8c-8a59-c9f5be656cab ",tempoelementid:"tempo-a25f4c52-2937-5c8c-8a59-c9f5be656cab",children:"معادلة صافي الراتب"}),e.jsx(s,{value:f,onChange:a=>r(a.target.value),className:"font-mono text-right tempo-20301e30-ad76-59c1-abc3-5e5a094ea7c7",dir:"ltr",tempoelementid:"tempo-20301e30-ad76-59c1-abc3-5e5a094ea7c7"})]},"164772729519493184037695747758969170035-15"),e.jsxs("div",{className:"space-y-2 tempo-0872c7ae-423d-5879-b11a-8ed37f1b82df",tempoelementid:"tempo-0872c7ae-423d-5879-b11a-8ed37f1b82df",children:[e.jsx(d,{className:"tempo-3978d870-383b-5f93-98e0-61a6f19a6249 ",tempoelementid:"tempo-3978d870-383b-5f93-98e0-61a6f19a6249",children:"معادلة قيمة اليوم الواحد"}),e.jsx(s,{value:p,onChange:a=>b(a.target.value),className:"font-mono text-right tempo-f9af6635-e95a-5265-8c59-61996c2e8515",dir:"ltr",tempoelementid:"tempo-f9af6635-e95a-5265-8c59-61996c2e8515"})]},"164772729519493184037695747758969170035-18"),e.jsxs("div",{className:"space-y-2 tempo-3bc6a621-a9ba-5b86-a856-42e5987abfe2",tempoelementid:"tempo-3bc6a621-a9ba-5b86-a856-42e5987abfe2",children:[e.jsx(d,{className:"tempo-f1d2e98d-06ea-5edd-988c-6416783576d6 ",tempoelementid:"tempo-f1d2e98d-06ea-5edd-988c-6416783576d6",children:"معادلة الأوفرتايم"}),e.jsx(s,{value:u,onChange:a=>x(a.target.value),className:"font-mono text-right tempo-2ed0faa5-8224-58f6-9b1e-9ab4a65917d7",dir:"ltr",tempoelementid:"tempo-2ed0faa5-8224-58f6-9b1e-9ab4a65917d7"})]},"164772729519493184037695747758969170035-21")]},"164772729519493184037695747758969170035-8")}),e.jsxs(h,{className:"p-6 tempo-fee69fd1-e61f-516c-a36d-a522a2cd7550",tempoelementid:"tempo-fee69fd1-e61f-516c-a36d-a522a2cd7550",children:[e.jsx("h2",{className:"text-xl font-semibold mb-4 tempo-93ae99fd-4085-5f3a-93a2-dd6d5498fcee",tempoelementid:"tempo-93ae99fd-4085-5f3a-93a2-dd6d5498fcee",children:"المتغيرات المتاحة"},"164772729519493184037695747758969170035-25"),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 tempo-33bf023f-c094-5f9d-a579-65ee8ba4299b",tempoelementid:"tempo-33bf023f-c094-5f9d-a579-65ee8ba4299b",children:v.map(a=>e.jsxs("div",{className:"flex items-start gap-2 tempo-fa9c7d69-224c-5d42-ae39-46cffff52b15",tempoelementid:"tempo-fa9c7d69-224c-5d42-ae39-46cffff52b15",children:[e.jsx("div",{className:"p-1 bg-primary/10 rounded text-primary tempo-a4562710-52de-52c4-99c3-594e195344fa",tempoelementid:"tempo-a4562710-52de-52c4-99c3-594e195344fa",children:e.jsx(F,{className:"h-4 w-4 tempo-9f0c2d16-c5bb-5416-815a-872033af6985",tempoelementid:"tempo-9f0c2d16-c5bb-5416-815a-872033af6985"})},"164772729519493184037695747758969170035-28"),e.jsxs("div",{className:"tempo-696d075d-f90d-59db-b1e6-9ceddf0ab3bb ",tempoelementid:"tempo-696d075d-f90d-59db-b1e6-9ceddf0ab3bb",children:[e.jsx("p",{className:"font-mono font-medium tempo-d60a4775-c4f0-55d7-be22-a3e5d46055c5",tempoelementid:"tempo-d60a4775-c4f0-55d7-be22-a3e5d46055c5",children:a.name},"164772729519493184037695747758969170035-31"),e.jsx("p",{className:"text-sm text-muted-foreground tempo-a235694b-cfd9-53a2-a829-4bb966ecfca7",tempoelementid:"tempo-a235694b-cfd9-53a2-a829-4bb966ecfca7",children:a.description},"164772729519493184037695747758969170035-32")]},"164772729519493184037695747758969170035-30")]},a.name))},"164772729519493184037695747758969170035-26")]})]},"164772729519493184037695747758969170035-5"):e.jsxs("div",{className:"flex h-full flex-col items-center justify-center p-4 text-center tempo-1993010f-10bb-5fd2-89c6-2d87207f1a93",tempoelementid:"tempo-1993010f-10bb-5fd2-89c6-2d87207f1a93",children:[e.jsx("h1",{className:"text-2xl font-bold text-red-600 mb-2 tempo-f97433e9-db6b-5b27-b76b-19520f8ef118",tempoelementid:"tempo-f97433e9-db6b-5b27-b76b-19520f8ef118",children:"غير مصرح"},"164772729519493184037695747758969170035-2"),e.jsx("p",{className:"mb-4 tempo-661d6542-43ee-5fc7-b810-bd21d09cabdd",tempoelementid:"tempo-661d6542-43ee-5fc7-b810-bd21d09cabdd",children:"ليس لديك صلاحية للوصول إلى هذه الصفحة"},"164772729519493184037695747758969170035-3"),e.jsx(m,{onClick:()=>window.history.back(),className:"tempo-613ba231-8729-56f4-8ddd-75ccf3df55dc ",tempoelementid:"tempo-613ba231-8729-56f4-8ddd-75ccf3df55dc",children:"العودة"})]},"164772729519493184037695747758969170035-1")}export{P as default};
