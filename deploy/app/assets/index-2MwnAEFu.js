import{f as A,r as m,j as e,D as R,g as T,h as O,i as K,L as D,k as _,B as n,l as F,U as I,C as P,E as $,e as C,m as z}from"./index-DCzl8a2M.js";import{D as B}from"./data-table-Dyk-SJUO.js";import{A as L,a as V,b as q,c as H,d as U,e as M,f as G,g as J}from"./alert-dialog-mt10r_ul.js";import{T as S}from"./textarea-CQHQAEMr.js";import{S as Q}from"./save-CuLUMJM-.js";import{S as W}from"./square-pen-DyTrw8aF.js";import{T as X}from"./trash-2-BU5t-Hxw.js";/**
 * @license lucide-react v0.394.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=A("Award",[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]]);function Z({open:y,onOpenChange:i,employeeId:h,employeeName:N,onSave:f}){const[s,l]=m.useState([{id:"1",name:"جودة العمل",description:"دقة وجودة العمل المنجز",rating:0,comments:""},{id:"2",name:"الإنتاجية",description:"كمية العمل المنجز في الوقت المحدد",rating:0,comments:""},{id:"3",name:"المبادرة",description:"القدرة على اتخاذ المبادرة وحل المشكلات",rating:0,comments:""},{id:"4",name:"العمل الجماعي",description:"القدرة على العمل ضمن فريق",rating:0,comments:""},{id:"5",name:"الالتزام",description:"الالتزام بمواعيد العمل والحضور",rating:0,comments:""}]),[x,p]=m.useState(""),b=(t,d)=>{l(s.map(c=>c.id===t?{...c,rating:d}:c))},g=(t,d)=>{l(s.map(c=>c.id===t?{...c,comments:d}:c))},u=()=>s.reduce((d,c)=>d+c.rating,0)/s.length,j=()=>{f({employeeId:h,criteria:s,overallRating:u(),overallComments:x}),i(!1)},r=(t,d)=>e.jsx("div",{className:"flex gap-1 tempo-bdfc6c4c-a4b6-5bf5-95c7-ccff9b4c6395",tempoelementid:"tempo-bdfc6c4c-a4b6-5bf5-95c7-ccff9b4c6395",children:[1,2,3,4,5].map(c=>e.jsx("button",{type:"button",onClick:()=>b(t,c),className:`w-8 h-8 rounded-full ${d>=c?"bg-yellow-400":"bg-gray-200"} tempo-b15651f2-0ab9-5da6-8e38-b2cfd12cd326`,"aria-label":`Rate ${c} stars`,tempoelementid:"tempo-b15651f2-0ab9-5da6-8e38-b2cfd12cd326",children:c},c))},"57291464786325887327489254374376181558-1");return e.jsx(R,{open:y,onOpenChange:i,className:"tempo-0aebc55b-072d-5ad8-aa5f-ad2ee7ae4717 ",tempoelementid:"tempo-0aebc55b-072d-5ad8-aa5f-ad2ee7ae4717",children:e.jsxs(T,{className:"max-w-3xl tempo-6ddad95a-c204-5a6e-aa80-f431aef7d311",dir:"rtl",tempoelementid:"tempo-6ddad95a-c204-5a6e-aa80-f431aef7d311",children:[e.jsx(O,{className:"tempo-5e2ffb70-3553-5f6f-9e1a-679e090ffc70 ",tempoelementid:"tempo-5e2ffb70-3553-5f6f-9e1a-679e090ffc70",children:e.jsxs(K,{className:"tempo-ee41baf5-8c1b-5cfe-8b84-bde3c2bb4af2 ",tempoelementid:"tempo-ee41baf5-8c1b-5cfe-8b84-bde3c2bb4af2",children:["تقييم أداء الموظف: ",N]})}),e.jsxs("div",{className:"space-y-6 py-4 tempo-d0eea0b4-1800-57b9-919f-19ce222b0bb4",tempoelementid:"tempo-d0eea0b4-1800-57b9-919f-19ce222b0bb4",children:[s.map(t=>e.jsxs("div",{className:"space-y-2 border-b pb-4 tempo-6ae3b002-31d5-56da-b090-f8172e1c4b97",tempoelementid:"tempo-6ae3b002-31d5-56da-b090-f8172e1c4b97",children:[e.jsxs("div",{className:"flex justify-between items-start tempo-7a609654-f95c-5575-a290-733ab989d0e6",tempoelementid:"tempo-7a609654-f95c-5575-a290-733ab989d0e6",children:[e.jsxs("div",{className:"tempo-9ab4c1be-d008-5fee-a4a7-548721fe01df ",tempoelementid:"tempo-9ab4c1be-d008-5fee-a4a7-548721fe01df",children:[e.jsx("h3",{className:"font-medium tempo-7f3681f5-6b98-51fc-af69-ce7cfb5246e3",tempoelementid:"tempo-7f3681f5-6b98-51fc-af69-ce7cfb5246e3",children:t.name},"57291464786325887327489254374376181558-11"),e.jsx("p",{className:"text-sm text-muted-foreground tempo-18718c47-554c-5014-b077-9be83223f1c8",tempoelementid:"tempo-18718c47-554c-5014-b077-9be83223f1c8",children:t.description},"57291464786325887327489254374376181558-12")]},"57291464786325887327489254374376181558-10"),r(t.id,t.rating)]},"57291464786325887327489254374376181558-9"),e.jsxs("div",{className:"space-y-1 tempo-be223739-0dc3-5d19-bf2d-1f86b086391a",tempoelementid:"tempo-be223739-0dc3-5d19-bf2d-1f86b086391a",children:[e.jsx(D,{className:"tempo-e08d346b-da21-528c-91ea-53d0f3e6ed77 ",tempoelementid:"tempo-e08d346b-da21-528c-91ea-53d0f3e6ed77",children:"ملاحظات"}),e.jsx(S,{value:t.comments,onChange:d=>g(t.id,d.target.value),className:"text-right tempo-dd0c2bd0-db2b-5e2c-b92f-ed57ec79862b",placeholder:"أضف ملاحظاتك هنا...",tempoelementid:"tempo-dd0c2bd0-db2b-5e2c-b92f-ed57ec79862b"})]},"57291464786325887327489254374376181558-13")]},t.id)),e.jsxs("div",{className:"space-y-2 tempo-bbc33813-8760-57c8-8693-eddf5a29eb40",tempoelementid:"tempo-bbc33813-8760-57c8-8693-eddf5a29eb40",children:[e.jsx(D,{className:"tempo-8dc5bae5-7217-55e1-871c-25e46dc6575f ",tempoelementid:"tempo-8dc5bae5-7217-55e1-871c-25e46dc6575f",children:"ملاحظات عامة"}),e.jsx(S,{value:x,onChange:t=>p(t.target.value),className:"text-right tempo-1e8a4552-d7ee-5826-9329-6531bec5a3fb",placeholder:"أضف ملاحظات عامة حول أداء الموظف...",tempoelementid:"tempo-1e8a4552-d7ee-5826-9329-6531bec5a3fb"})]},"57291464786325887327489254374376181558-16"),e.jsx("div",{className:"bg-muted p-4 rounded-md tempo-2833bb61-c77a-565c-86c9-d04756c0f268",tempoelementid:"tempo-2833bb61-c77a-565c-86c9-d04756c0f268",children:e.jsxs("div",{className:"flex justify-between items-center tempo-4c19c1e2-173d-5705-ad29-14643fede51e",tempoelementid:"tempo-4c19c1e2-173d-5705-ad29-14643fede51e",children:[e.jsx("span",{className:"font-medium tempo-55a2c793-1f8c-5d69-a616-4fc6e188da12",tempoelementid:"tempo-55a2c793-1f8c-5d69-a616-4fc6e188da12",children:"التقييم العام:"},"57291464786325887327489254374376181558-21"),e.jsxs("span",{className:"font-bold text-lg tempo-dda61141-b521-5d61-8a9e-76e54f05b8bf",tempoelementid:"tempo-dda61141-b521-5d61-8a9e-76e54f05b8bf",children:[u().toFixed(1)," / 5"]},"57291464786325887327489254374376181558-22")]},"57291464786325887327489254374376181558-20")},"57291464786325887327489254374376181558-19")]},"57291464786325887327489254374376181558-7"),e.jsxs(_,{className:"gap-2 tempo-505f0e88-6a0f-5565-a3ac-093b45274df7",tempoelementid:"tempo-505f0e88-6a0f-5565-a3ac-093b45274df7",children:[e.jsx(n,{variant:"outline",onClick:()=>i(!1),className:"tempo-0cef8cae-7236-5999-bc9b-356002537d8a ",tempoelementid:"tempo-0cef8cae-7236-5999-bc9b-356002537d8a",children:"إلغاء"}),e.jsxs(n,{onClick:j,className:"tempo-a3e9bfb7-3545-568c-8d6d-abdd6e4afbf3 ",tempoelementid:"tempo-a3e9bfb7-3545-568c-8d6d-abdd6e4afbf3",children:[e.jsx(Q,{className:"ml-2 h-4 w-4 tempo-6ac007e1-760d-5b23-819e-87972218c6c0",tempoelementid:"tempo-6ac007e1-760d-5b23-819e-87972218c6c0"}),"حفظ التقييم"]})]})]})})}function oe(){const{employees:y,loading:i,refetch:h}=F(),[N,f]=m.useState(!1),[s,l]=m.useState(null),[x,p]=m.useState(!1),[b,g]=m.useState(null),[u,j]=m.useState(!1),[r,t]=m.useState(null),[d,c]=m.useState({}),E=async()=>{if(b)try{C?await C.from("employees").delete().eq("id",b):console.log("Mock delete employee:",b),h()}catch(a){console.error("Error deleting employee:",a)}finally{p(!1),g(null)}},w=a=>{console.log("Saving evaluation:",a),c({...d,[a.employeeId]:a.overallRating})},k=[{accessorKey:"name",header:"اسم الموظف"},{accessorKey:"position",header:"المنصب",cell:({row:a})=>a.getValue("position")||"--"},{accessorKey:"department",header:"القسم",cell:({row:a})=>a.getValue("department")||"--"},{accessorKey:"base_salary",header:"الراتب الأساسي",cell:({row:a})=>`${a.getValue("base_salary")} ج.م`},{accessorKey:"monthly_incentives",header:"الحوافز الشهرية",cell:({row:a})=>`${a.original.monthly_incentives||0} ج.م`},{accessorKey:"join_date",header:"تاريخ الانضمام"},{accessorKey:"status",header:"الحالة",cell:({row:a})=>{const o=a.original.status||"active";return e.jsx(z,{className:(o==="active"?"bg-green-100 text-green-800":"bg-red-100 text-red-800")+" tempo-13b4b7e9-f98d-5b89-868c-b33c23a13f0d",tempoelementid:"tempo-13b4b7e9-f98d-5b89-868c-b33c23a13f0d",children:o==="active"?"نشط":"غير نشط"})}},{id:"rating",header:"التقييم",cell:({row:a})=>{const o=a.original.id,v=d[o]||0;return v>0?e.jsxs("div",{className:"flex items-center tempo-b61e9bf0-e5de-5fbf-acb3-cc2a11652da0",tempoelementid:"tempo-b61e9bf0-e5de-5fbf-acb3-cc2a11652da0",children:[e.jsx("span",{className:"font-medium tempo-729cb3cc-7431-5300-aa37-dd7b02b050c5",tempoelementid:"tempo-729cb3cc-7431-5300-aa37-dd7b02b050c5",children:v.toFixed(1)},"242827445343324328365456586962888447280-3"),e.jsx("span",{className:"text-yellow-500 ml-1 tempo-95a541ec-b386-58df-9af8-f1d6e03ca571",tempoelementid:"tempo-95a541ec-b386-58df-9af8-f1d6e03ca571",children:"★"},"242827445343324328365456586962888447280-4")]},"242827445343324328365456586962888447280-2"):e.jsx("span",{className:"text-muted-foreground tempo-d105d6ce-63b2-5767-890a-6c78241f834e",tempoelementid:"tempo-d105d6ce-63b2-5767-890a-6c78241f834e",children:"لا يوجد"},"242827445343324328365456586962888447280-5")}},{id:"actions",cell:({row:a})=>{const o=a.original;return e.jsxs("div",{className:"flex items-center justify-end gap-2 tempo-f7a1d572-ce6d-5f8e-bdb3-f05053f0e0d1",tempoelementid:"tempo-f7a1d572-ce6d-5f8e-bdb3-f05053f0e0d1",children:[e.jsx(n,{variant:"ghost",size:"icon",onClick:()=>{t(o),j(!0)},title:"تقييم الأداء",className:"tempo-c5d1f921-9156-5c23-8dd8-d489946cac27 ",tempoelementid:"tempo-c5d1f921-9156-5c23-8dd8-d489946cac27",children:e.jsx(Y,{className:"h-4 w-4 text-yellow-600 tempo-40b5ee8e-4035-5e59-816a-ec09b193ba42",tempoelementid:"tempo-40b5ee8e-4035-5e59-816a-ec09b193ba42"})}),e.jsx(n,{variant:"ghost",size:"icon",onClick:()=>{l(o),f(!0)},title:"تعديل",className:"tempo-dc3fb7d1-8e4a-5876-82bc-d6dbfce0fb7f ",tempoelementid:"tempo-dc3fb7d1-8e4a-5876-82bc-d6dbfce0fb7f",children:e.jsx(W,{className:"h-4 w-4 tempo-a490b898-ea2a-50f4-b0b6-b1d29c50c7c5",tempoelementid:"tempo-a490b898-ea2a-50f4-b0b6-b1d29c50c7c5"})}),e.jsx(n,{variant:"ghost",size:"icon",onClick:()=>{g(o.id),p(!0)},title:"حذف",className:"tempo-2094cdb4-e7ea-55dc-89ff-eff763a5453a ",tempoelementid:"tempo-2094cdb4-e7ea-55dc-89ff-eff763a5453a",children:e.jsx(X,{className:"h-4 w-4 text-destructive tempo-14555668-6ece-5e52-a65f-99656cd7943d",tempoelementid:"tempo-14555668-6ece-5e52-a65f-99656cd7943d"})})]},"242827445343324328365456586962888447280-6")}}];return i?e.jsx("div",{className:"flex justify-center p-8 tempo-e5415af3-4adb-5c7d-9e39-ee7bc5f29a8a",tempoelementid:"tempo-e5415af3-4adb-5c7d-9e39-ee7bc5f29a8a",children:"جاري التحميل..."},"242827445343324328365456586962888447280-13"):e.jsxs("div",{className:"space-y-6 tempo-9ff8f7b7-2a6f-5a3e-aca5-6e07c170b9a8",dir:"rtl",tempoelementid:"tempo-9ff8f7b7-2a6f-5a3e-aca5-6e07c170b9a8",children:[e.jsxs("div",{className:"flex items-center justify-between tempo-ba0d92c2-ed48-52bc-9133-de236cd04af2",tempoelementid:"tempo-ba0d92c2-ed48-52bc-9133-de236cd04af2",children:[e.jsx("h1",{className:"text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block tempo-2dd812de-5bcd-58e3-be5e-5f75b12c08ad",tempoelementid:"tempo-2dd812de-5bcd-58e3-be5e-5f75b12c08ad",children:"إدارة الموظفين"},"242827445343324328365456586962888447280-16"),e.jsxs(n,{onClick:()=>{l(null),f(!0)},className:"tempo-7366aa28-61f3-5f97-9f10-08f2f000d3a8 ",tempoelementid:"tempo-7366aa28-61f3-5f97-9f10-08f2f000d3a8",children:[e.jsx(I,{className:"ml-2 h-4 w-4 tempo-990a8512-0f15-509b-8456-a6c0b5fe8766",tempoelementid:"tempo-990a8512-0f15-509b-8456-a6c0b5fe8766"}),"إضافة موظف جديد"]})]},"242827445343324328365456586962888447280-15"),e.jsx(P,{className:"p-6 tempo-07f47c4d-c703-526f-af1d-badb91132f05",tempoelementid:"tempo-07f47c4d-c703-526f-af1d-badb91132f05",children:e.jsx(B,{columns:k,data:y,searchKey:"name",className:"tempo-ca624ded-9a91-5337-acd0-ae6faf77ca5b ",tempoelementid:"tempo-ca624ded-9a91-5337-acd0-ae6faf77ca5b"})}),e.jsx($,{open:N,onOpenChange:f,employee:s||void 0,onSuccess:()=>{l(null),h()},className:"tempo-dd34e84c-d3bb-5241-a28a-5fa293f6a782 ",tempoelementid:"tempo-dd34e84c-d3bb-5241-a28a-5fa293f6a782"}),r&&e.jsx(Z,{open:u,onOpenChange:j,employeeId:r.id,employeeName:r.name,onSave:w,className:"tempo-6aefba5e-c1ed-589b-9978-459a96ee4886 ",tempoelementid:"tempo-6aefba5e-c1ed-589b-9978-459a96ee4886"}),e.jsx(L,{open:x,onOpenChange:p,className:"tempo-39f65230-3421-573a-88c2-8fe058474517 ",tempoelementid:"tempo-39f65230-3421-573a-88c2-8fe058474517",children:e.jsxs(V,{dir:"rtl",className:"tempo-dc2da459-0157-5c83-955a-ef1ab3e53a68 ",tempoelementid:"tempo-dc2da459-0157-5c83-955a-ef1ab3e53a68",children:[e.jsxs(q,{className:"tempo-4fb09339-528d-574a-a6c7-587e5c205018 ",tempoelementid:"tempo-4fb09339-528d-574a-a6c7-587e5c205018",children:[e.jsx(H,{className:"tempo-ef901416-07d7-520c-ada1-95a51c02ece9 ",tempoelementid:"tempo-ef901416-07d7-520c-ada1-95a51c02ece9",children:"هل أنت متأكد من حذف هذا الموظف؟"}),e.jsx(U,{className:"tempo-0c56e9b6-c5ae-5ded-8567-49f930dcfe63 ",tempoelementid:"tempo-0c56e9b6-c5ae-5ded-8567-49f930dcfe63",children:"هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بيانات الموظف بشكل دائم."})]}),e.jsxs(M,{className:"flex-row-reverse justify-start gap-2 tempo-f3844264-283a-539a-868f-a0838d7c35e5",tempoelementid:"tempo-f3844264-283a-539a-868f-a0838d7c35e5",children:[e.jsx(G,{className:"tempo-af03f661-6635-5dc6-8c06-e51603f5c989 ",tempoelementid:"tempo-af03f661-6635-5dc6-8c06-e51603f5c989",children:"إلغاء"}),e.jsx(J,{onClick:E,className:"bg-destructive hover:bg-destructive/90 tempo-5cddbdb7-aa9c-540d-a443-05873cf45ca5",tempoelementid:"tempo-5cddbdb7-aa9c-540d-a443-05873cf45ca5",children:"حذف"})]})]})})]},"242827445343324328365456586962888447280-14")}export{oe as default};
