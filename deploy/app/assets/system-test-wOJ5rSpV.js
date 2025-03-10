const __vite__fileDeps=["assets/sync-data-Bpv-UO5-.js","assets/index-DCzl8a2M.js","assets/index-BDXx1mQP.css"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{f as S,e as m,_ as x,r as i,j as t,a7 as N,B as v,C as u,d as j,m as p,ar as w}from"./index-DCzl8a2M.js";import{a as h}from"./auth-service-CPjkIBTZ.js";import{R as C}from"./refresh-cw-B6-TPpno.js";/**
 * @license lucide-react v0.394.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=S("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);async function E(){const e={};return e.database=await O(),e.auth=await I(),e.employees=await J(),e.salaries=await D(),e.activityLogs=await L(),e.advances=await F(),e.attendance=await _(),e.reports=await A(),e.backup=await T(),e.sync=await R(),e}async function O(){try{if(!m)return{success:!1,message:"Supabase client not initialized. Check environment variables."};const{error:e}=await m.from("employees").select("id").limit(1);return e?{success:!1,message:"Failed to connect to Supabase.",details:e}:{success:!0,message:"Supabase connection successful."}}catch(e){return{success:!1,message:"Error testing Supabase connection.",details:e}}}async function I(){try{if(!h)return{success:!1,message:"Auth service not initialized."};const{success:e,users:a}=await h.getUsers();return e?a.find(r=>r.role==="admin")?{success:!0,message:`Authentication system working. Found ${a.length} users including ${a.filter(r=>r.role==="admin").length} admin(s).`,details:{userCount:a.length,adminCount:a.filter(r=>r.role==="admin").length}}:{success:!1,message:"No admin user found. System requires at least one admin user."}:{success:!1,message:"Failed to get users from auth service."}}catch(e){return{success:!1,message:"Error testing authentication system.",details:e}}}async function J(){try{const e=JSON.parse(localStorage.getItem("employees")||"[]");if(e.length===0)return{success:!1,message:"No employees found in the system."};const a=e.filter(s=>s.id&&s.name&&(s.base_salary||s.basicSalary)&&s.join_date);return a.length<e.length?{success:!1,message:`Found ${e.length} employees, but ${e.length-a.length} have missing required fields.`}:{success:!0,message:`Employee system working. Found ${e.length} valid employees.`,details:{employeeCount:e.length}}}catch(e){return{success:!1,message:"Error testing employee functions.",details:e}}}async function D(){try{const e=JSON.parse(localStorage.getItem("employees")||"[]"),a=JSON.parse(localStorage.getItem("salaries")||"[]");if(e.length===0)return{success:!1,message:"No employees found for salary calculation test."};const s=e[0],r=s.base_salary||s.basicSalary||0,n=s.monthly_incentives||0,o=r+n,l=r/30;return isNaN(o)||isNaN(l)?{success:!1,message:"Salary calculation failed with test employee."}:{success:!0,message:`Salary calculation system working. ${a.length>0?`Found ${a.length} saved salary records.`:"No saved salary records yet."}`,details:{salaryRecords:a.length,testCalculation:{baseSalary:r,incentives:n,totalSalary:o,dailyRate:l}}}}catch(e){return{success:!1,message:"Error testing salary calculation.",details:e}}}async function L(){try{const e=JSON.parse(localStorage.getItem("activity_logs")||"[]"),a={id:Date.now().toString(),user_id:"system-test",type:"system",action:"test",description:"System test activity log",created_at:new Date().toISOString()},s=[a,...e];localStorage.setItem("activity_logs",JSON.stringify(s));const r=JSON.parse(localStorage.getItem("activity_logs")||"[]");return r.some(o=>o.id===a.id)?{success:!0,message:`Activity logging system working. Found ${r.length} activity logs.`,details:{logCount:r.length}}:{success:!1,message:"Failed to add test activity log."}}catch(e){return{success:!1,message:"Error testing activity logs.",details:e}}}async function F(){try{const e=JSON.parse(localStorage.getItem("advances")||"[]");if(e.length===0)return{success:!1,message:"No advances found in the system."};const a=e.filter(n=>n.id&&n.employeeId&&n.amount&&n.requestDate&&n.expectedRepaymentDate);if(a.length<e.length)return{success:!1,message:`Found ${e.length} advances, but ${e.length-a.length} have missing required fields.`};const s=e.filter(n=>n.status==="pending").length,r=e.filter(n=>n.status==="paid").length;return{success:!0,message:`Advances system working. Found ${e.length} advances (${s} pending, ${r} paid).`,details:{advanceCount:e.length,pendingCount:s,paidCount:r}}}catch(e){return{success:!1,message:"Error testing advances system.",details:e}}}async function _(){try{const e=JSON.parse(localStorage.getItem("absences")||"[]");if(e.length===0)return{success:!1,message:"No absences found in the system."};const a=e.filter(n=>n.id&&n.employeeId&&n.startDate&&n.endDate&&n.type);if(a.length<e.length)return{success:!1,message:`Found ${e.length} absences, but ${e.length-a.length} have missing required fields.`};const s=e.filter(n=>n.type==="annual").length,r=e.filter(n=>n.type==="sick").length;return{success:!0,message:`Attendance system working. Found ${e.length} absences (${s} annual, ${r} sick).`,details:{absenceCount:e.length,annualCount:s,sickCount:r}}}catch(e){return{success:!1,message:"Error testing attendance system.",details:e}}}async function A(){try{const e=JSON.parse(localStorage.getItem("employees")||"[]"),a=JSON.parse(localStorage.getItem("salaries")||"[]"),s=JSON.parse(localStorage.getItem("advances")||"[]"),r=JSON.parse(localStorage.getItem("absences")||"[]");return e.length===0||a.length===0?{success:!1,message:"Insufficient data for generating reports. Need employees and salary data."}:{success:!0,message:`Report system ready. Data available: ${e.length} employees, ${a.length} salary records, ${s.length} advances, ${r.length} absences.`,details:{employeeCount:e.length,salaryCount:a.length,advanceCount:s.length,absenceCount:r.length}}}catch(e){return{success:!1,message:"Error testing report system.",details:e}}}async function R(){try{if(!m)return{success:!1,message:"Supabase client not initialized. Data synchronization requires Supabase."};const{error:e}=await m.from("employees").select("id").limit(1);if(e)return{success:!1,message:"Failed to connect to Supabase for data synchronization.",details:e};const{syncAllData:a}=await x(async()=>{const{syncAllData:r}=await import("./sync-data-Bpv-UO5-.js");return{syncAllData:r}},__vite__mapDeps([0,1,2])),s=await a();return s.success?{success:!0,message:"Data synchronization system working. Supabase connection established and sync functions available.",details:{syncResult:s}}:{success:!1,message:`Data synchronization test failed: ${s.message}`}}catch(e){return{success:!1,message:"Error testing data synchronization.",details:e}}}async function T(){try{const e=JSON.parse(localStorage.getItem("employees")||"[]"),a=JSON.parse(localStorage.getItem("salaries")||"[]"),s=JSON.parse(localStorage.getItem("advances")||"[]"),r=JSON.parse(localStorage.getItem("absences")||"[]"),n=JSON.parse(localStorage.getItem("users")||"[]"),o=JSON.parse(localStorage.getItem("activity_logs")||"[]"),l={timestamp:new Date().toISOString(),version:"1.0",data:{employees:e,salaries:a,advances:s,absences:r,users:n,activityLogs:o}};return!l||!l.data?{success:!1,message:"Failed to create backup data object."}:{success:!0,message:`Backup system ready. Data available for backup: ${e.length} employees, ${a.length} salary records, ${n.length} users, ${o.length} activity logs.`,details:{employeeCount:e.length,salaryCount:a.length,advanceCount:s.length,absenceCount:r.length,userCount:n.length,logCount:o.length,backupSize:JSON.stringify(l).length}}}catch(e){return{success:!1,message:"Error testing backup system.",details:e}}}function B(){const[e,a]=i.useState(!1),[s,r]=i.useState(null),[n,o]=i.useState(null),[l,g]=i.useState(null),b=async()=>{a(!0),o(new Date),g(null);try{const c=await E();r(c)}catch(c){console.error("Error running tests:",c),r({error:!0,message:`Error running tests: ${c instanceof Error?c.message:String(c)}`})}finally{a(!1),g(new Date)}};i.useEffect(()=>{b()},[]);const y=c=>c?t.jsxs(p,{className:"bg-green-100 text-green-800 tempo-5fbd2a4d-5789-5d6e-87c2-4dfbb9307209",tempoelementid:"tempo-5fbd2a4d-5789-5d6e-87c2-4dfbb9307209",children:[t.jsx($,{className:"h-3 w-3 mr-1 tempo-a49b5022-2f57-5ac3-8013-bb14c15a5039",tempoelementid:"tempo-a49b5022-2f57-5ac3-8013-bb14c15a5039"})," ناجح"]}):t.jsxs(p,{className:"bg-red-100 text-red-800 tempo-abb90ed4-2c87-50c5-bc88-0efdbdf7887c",tempoelementid:"tempo-abb90ed4-2c87-50c5-bc88-0efdbdf7887c",children:[t.jsx(w,{className:"h-3 w-3 mr-1 tempo-507bf87b-5b51-58e1-8f44-5c44a09c3a9d",tempoelementid:"tempo-507bf87b-5b51-58e1-8f44-5c44a09c3a9d"})," فشل"]}),f=s&&Object.values(s).every(c=>c.success);return t.jsxs("div",{className:"space-y-6 tempo-f8e452d9-31f1-58b4-ae18-c41c40e1c2ee",dir:"rtl",tempoelementid:"tempo-f8e452d9-31f1-58b4-ae18-c41c40e1c2ee",children:[t.jsx(N,{title:"اختبار النظام",description:"التحقق من جاهزية النظام للنشر",actions:t.jsxs(v,{onClick:b,disabled:e,children:[t.jsx(C,{className:"ml-2 h-4 w-4"}),"إعادة الاختبار"]}),className:"tempo-d51d137e-223e-50e6-ae6a-42a4fe79227a ",tempoelementid:"tempo-d51d137e-223e-50e6-ae6a-42a4fe79227a"}),e?t.jsx(u,{className:"p-6 tempo-598907f5-9720-538a-8eab-6fc369a55717",tempoelementid:"tempo-598907f5-9720-538a-8eab-6fc369a55717",children:t.jsxs("div",{className:"flex flex-col items-center justify-center py-8 tempo-16a27982-b463-55ce-af35-998cc7d96156",tempoelementid:"tempo-16a27982-b463-55ce-af35-998cc7d96156",children:[t.jsx(j,{size:"lg",className:"tempo-79b22499-11a9-5063-a970-d10379bb7bcc ",tempoelementid:"tempo-79b22499-11a9-5063-a970-d10379bb7bcc"}),t.jsx("p",{className:"mt-4 text-lg tempo-821bb9fc-fd58-5f3e-a454-61c509267f70",tempoelementid:"tempo-821bb9fc-fd58-5f3e-a454-61c509267f70",children:"جاري اختبار النظام..."},"210260546348847679777258221638155441354-10")]},"210260546348847679777258221638155441354-8")}):s?t.jsxs(t.Fragment,{children:[t.jsxs(u,{className:"p-6 tempo-5ac67917-12c0-5820-904d-eb055178332d",tempoelementid:"tempo-5ac67917-12c0-5820-904d-eb055178332d",children:[t.jsxs("div",{className:"flex items-center justify-between mb-6 tempo-81cabadb-f814-5e82-afa8-114cf282f56f",tempoelementid:"tempo-81cabadb-f814-5e82-afa8-114cf282f56f",children:[t.jsx("h2",{className:"text-xl font-semibold tempo-90184690-22a3-5aaf-8521-6b205d226af9",tempoelementid:"tempo-90184690-22a3-5aaf-8521-6b205d226af9",children:"نتائج الاختبار"},"210260546348847679777258221638155441354-13"),t.jsx(p,{className:(f?"bg-green-100 text-green-800":"bg-red-100 text-red-800")+" tempo-6b6c17cc-c962-5897-962a-c88b2e3d2c89",tempoelementid:"tempo-6b6c17cc-c962-5897-962a-c88b2e3d2c89",children:f?"جميع الاختبارات ناجحة":"بعض الاختبارات فشلت"})]},"210260546348847679777258221638155441354-12"),n&&l&&t.jsxs("div",{className:"mb-4 text-sm text-muted-foreground tempo-d934934d-72aa-5234-bf27-ff9015036396",tempoelementid:"tempo-d934934d-72aa-5234-bf27-ff9015036396",children:[t.jsxs("p",{className:"tempo-3e9cb70e-0d95-5eba-b7ea-1349ca1e55e6 ",tempoelementid:"tempo-3e9cb70e-0d95-5eba-b7ea-1349ca1e55e6",children:["وقت بدء الاختبار: ",n.toLocaleTimeString("ar-EG")]},"210260546348847679777258221638155441354-16"),t.jsxs("p",{className:"tempo-3c5ec8fe-0adc-5c9e-82aa-a0772adf031d ",tempoelementid:"tempo-3c5ec8fe-0adc-5c9e-82aa-a0772adf031d",children:["وقت انتهاء الاختبار: ",l.toLocaleTimeString("ar-EG")]},"210260546348847679777258221638155441354-17"),t.jsxs("p",{className:"tempo-276243c1-a84d-5591-b90a-ea4bdc713907 ",tempoelementid:"tempo-276243c1-a84d-5591-b90a-ea4bdc713907",children:["مدة الاختبار:"," ",((l.getTime()-n.getTime())/1e3).toFixed(2)," ","ثانية"]},"210260546348847679777258221638155441354-18")]},"210260546348847679777258221638155441354-15"),t.jsx("div",{className:"space-y-4 tempo-9e4238bb-4e5e-5231-8774-9553dcb3e6ab",tempoelementid:"tempo-9e4238bb-4e5e-5231-8774-9553dcb3e6ab",children:s.error?t.jsx("div",{className:"bg-red-50 border border-red-200 rounded-md p-4 tempo-6b4f91f2-6497-5d41-b02e-e304f1b45f8c",tempoelementid:"tempo-6b4f91f2-6497-5d41-b02e-e304f1b45f8c",children:t.jsx("p",{className:"text-red-800 tempo-ef9ce237-bc67-5afe-9600-269974dcad5f",tempoelementid:"tempo-ef9ce237-bc67-5afe-9600-269974dcad5f",children:s.message},"210260546348847679777258221638155441354-21")},"210260546348847679777258221638155441354-20"):Object.entries(s).map(([c,d])=>t.jsxs("div",{className:"border rounded-md p-4 tempo-69082d44-70ce-5c6e-899d-b7e398d3fd7b",tempoelementid:"tempo-69082d44-70ce-5c6e-899d-b7e398d3fd7b",children:[t.jsxs("div",{className:"flex items-center justify-between mb-2 tempo-f5b5b795-ed7a-5be3-8c3a-c3e715fd2103",tempoelementid:"tempo-f5b5b795-ed7a-5be3-8c3a-c3e715fd2103",children:[t.jsxs("h3",{className:"font-semibold tempo-6c7c001e-d324-57be-8b90-f061d31b9e09",tempoelementid:"tempo-6c7c001e-d324-57be-8b90-f061d31b9e09",children:[c==="database"&&"قاعدة البيانات",c==="auth"&&"نظام المصادقة",c==="employees"&&"نظام الموظفين",c==="salaries"&&"نظام الرواتب",c==="activityLogs"&&"سجل النشاطات",c==="advances"&&"نظام السلف",c==="attendance"&&"نظام الحضور والإجازات",c==="reports"&&"نظام التقارير",c==="backup"&&"نظام النسخ الاحتياطي"]},"210260546348847679777258221638155441354-24"),y(d.success)]},"210260546348847679777258221638155441354-23"),t.jsx("p",{className:"text-sm tempo-69b4453c-dc6d-5c20-97fc-9f5c30330d7d",tempoelementid:"tempo-69b4453c-dc6d-5c20-97fc-9f5c30330d7d",children:d.message},"210260546348847679777258221638155441354-25"),d.details&&Object.keys(d.details).length>0&&t.jsx("div",{className:"mt-2 text-xs bg-muted/50 p-2 rounded tempo-e3fe45d9-71c9-5eea-975a-6284f6fa2271",tempoelementid:"tempo-e3fe45d9-71c9-5eea-975a-6284f6fa2271",children:t.jsx("pre",{className:"whitespace-pre-wrap tempo-ef304f72-dd0c-5aed-92f7-1170c765bd06",tempoelementid:"tempo-ef304f72-dd0c-5aed-92f7-1170c765bd06",children:JSON.stringify(d.details,null,2)},"210260546348847679777258221638155441354-27")},"210260546348847679777258221638155441354-26")]},c))},"210260546348847679777258221638155441354-19")]}),t.jsxs(u,{className:"p-6 tempo-5448db71-d6e3-5e2b-a0d9-f7ffa103e2d7",tempoelementid:"tempo-5448db71-d6e3-5e2b-a0d9-f7ffa103e2d7",children:[t.jsx("h2",{className:"text-xl font-semibold mb-4 tempo-6c2e60bf-0096-5a8f-9ecd-97b2bcab5428",tempoelementid:"tempo-6c2e60bf-0096-5a8f-9ecd-97b2bcab5428",children:"توصيات النشر"},"210260546348847679777258221638155441354-29"),f?t.jsxs("div",{className:"bg-green-50 border border-green-200 rounded-md p-4 text-green-800 tempo-0813921c-b8d7-5722-b496-653476aff78c",tempoelementid:"tempo-0813921c-b8d7-5722-b496-653476aff78c",children:[t.jsx("p",{className:"font-semibold tempo-01a68dfb-c909-57dd-9caa-f49990da9098",tempoelementid:"tempo-01a68dfb-c909-57dd-9caa-f49990da9098",children:"النظام جاهز للنشر! ✅"},"210260546348847679777258221638155441354-31"),t.jsx("p",{className:"mt-2 tempo-b4f239b3-4bec-527f-a7e2-fe57871024c0",tempoelementid:"tempo-b4f239b3-4bec-527f-a7e2-fe57871024c0",children:"جميع الاختبارات ناجحة ويمكن المتابعة بعملية النشر."},"210260546348847679777258221638155441354-32")]},"210260546348847679777258221638155441354-30"):t.jsxs("div",{className:"bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 tempo-f81915b0-0697-52ab-8dd8-9ff512e73b3d",tempoelementid:"tempo-f81915b0-0697-52ab-8dd8-9ff512e73b3d",children:[t.jsx("p",{className:"font-semibold tempo-46de4d45-5350-5891-8283-9a5aca2d7d30",tempoelementid:"tempo-46de4d45-5350-5891-8283-9a5aca2d7d30",children:"هناك بعض المشاكل التي يجب معالجتها قبل النشر ⚠️"},"210260546348847679777258221638155441354-34"),t.jsx("p",{className:"mt-2 tempo-9cbfc7ad-d894-5724-88a3-97c72d1ecb0a",tempoelementid:"tempo-9cbfc7ad-d894-5724-88a3-97c72d1ecb0a",children:"يرجى مراجعة نتائج الاختبار أعلاه ومعالجة المشاكل قبل المتابعة."},"210260546348847679777258221638155441354-35"),t.jsx("ul",{className:"list-disc list-inside mt-2 tempo-4768aac5-fe30-59f4-ab31-0ed6d4078f32",tempoelementid:"tempo-4768aac5-fe30-59f4-ab31-0ed6d4078f32",children:Object.entries(s).map(([c,d])=>d.success?null:t.jsxs("li",{className:"tempo-9bf97936-3318-5763-aed0-2e506d836367 ",tempoelementid:"tempo-9bf97936-3318-5763-aed0-2e506d836367",children:[t.jsxs("span",{className:"font-medium tempo-f4fe26ad-9fd7-5b2b-a75a-331e9c5a882e",tempoelementid:"tempo-f4fe26ad-9fd7-5b2b-a75a-331e9c5a882e",children:[c==="database"&&"قاعدة البيانات",c==="auth"&&"نظام المصادقة",c==="employees"&&"نظام الموظفين",c==="salaries"&&"نظام الرواتب",c==="activityLogs"&&"سجل النشاطات",c==="advances"&&"نظام السلف",c==="attendance"&&"نظام الحضور والإجازات",c==="reports"&&"نظام التقارير",c==="backup"&&"نظام النسخ الاحتياطي"]},"210260546348847679777258221638155441354-38"),": ",d.message]},c))},"210260546348847679777258221638155441354-36")]},"210260546348847679777258221638155441354-33")]})]}):null]},"210260546348847679777258221638155441354-5")}export{B as default};
