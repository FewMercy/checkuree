(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[267],{41482:function(e,t,n){Promise.resolve().then(n.bind(n,29059))},62413:function(e,t,n){"use strict";var a=n(12607);class s extends a.Z{static getInstance(){return null==this.instance&&(this.instance=new s),this.instance}constructor(e){super("https://checkuree.com/api/v1",e),this.userLogin=e=>this.axios.request({method:"POST",url:"/auth/signin",data:e}),this.userRegister=e=>this.axios.request({method:"POST",url:"/auth/signup",data:e}),this.userCheckEmail=e=>this.axios.request({method:"GET",url:"/auth/check-email?email=".concat(e),data:e}),this.userCheckPhoneNumber=e=>this.axios.request({method:"GET",url:"/auth/check-mobile-number?mobileNumber=".concat(e),data:e}),this.userCheckUsername=e=>this.axios.request({method:"GET",url:"/auth/check-username?username=".concat(e),data:e}),this.userInfo=()=>this.axios.request({method:"GET",url:"/users"})}}t.Z=s},12607:function(e,t,n){"use strict";var a=n(7908),s=n(98955),r=n(44614);class i{getAccessToken(){var e;return(null===(e=this.tokens)||void 0===e?void 0:e.accessToken)?this.tokens.accessToken:s.Z.get("ACCESS_TOKEN")}getRefreshToken(){var e;return(null===(e=this.tokens)||void 0===e?void 0:e.refreshToken)?this.tokens.refreshToken:s.Z.get("REFRESH_TOKEN")}async refresh(e){let t=this.getRefreshToken();if(null!=t)try{let n=await a.Z.request({baseURL:"https://checkuree.com/api/v1",url:"/auth/refresh-token",method:"POST",data:{refreshToken:t}});return(0,r.d)({accessToken:n.data.data.accessToken,refreshToken:n.data.data.refreshToken}),a.Z.request({...e,headers:{...e.headers,Authorization:"Bearer ".concat(n.data.data.accessToken)}})}catch(e){console.error("[Refresh error]",e)}return(0,r.y)(),"/auth/signin"!==window.location.pathname&&window.location.replace("/auth/signin"),Promise.reject(Error("로그인을 연장할 수 없습니다."))}constructor(e,t){var n;this.tokens=t,this.axios=a.Z.create({baseURL:e,headers:{"Content-Type":"application/json","X-Requested-With":"XMLHttpRequest",Authorization:"Bearer ".concat(null===(n=this.tokens)||void 0===n?void 0:n.accessToken)}}),this.axios.interceptors.request.use(async e=>{let t=this.getAccessToken();return e.headers.Authorization="Bearer ".concat(t),e}),this.axios.interceptors.response.use(e=>e,async e=>{let{status:t,statusText:n,data:a,request:{responseURL:r}}=e.response;console.error("API Error => responseURL : ".concat(r," status:").concat(t," statusText:").concat(n," data:").concat(JSON.stringify(a)));let i=s.Z.get("ACCESS_TOKEN");return null!=i&&401===t?this.refresh(e.config):(401===t&&(e.config.headers.Authorization="Bearer ".concat(i)),Promise.reject(e))})}}t.Z=i},65282:function(e,t,n){"use strict";var a=n(12607);class s extends a.Z{static getInstance(){return null==this.instance&&(this.instance=new s),this.instance}constructor(e){super("https://checkuree.com/api/v1",e),this.getAttendanceList=()=>this.axios.request({method:"GET",url:"/attendances"}),this.getAttendanceDetail=e=>this.axios.request({method:"GET",url:"/attendances/".concat(e)}),this.getAttendanceSchedulesByDate=e=>{let{attendanceId:t,date:n,pageNo:a=1}=e;return this.axios.request({method:"GET",url:"/attendanceId/".concat(t,"/schedules/").concat(n),params:{pageNo:a}})},this.getAttendanceSummary=(e,t)=>this.axios.request({method:"GET",url:"/attendance/".concat(e,"/attendees/records/summary"),params:{attendeeIds:t}}),this.getAttendanceSummaryByDate=(e,t)=>this.axios.request({method:"GET",url:"/attendance/".concat(e,"/records/").concat(t,"/summary")}),this.getAttendeeList=e=>this.axios.request({method:"GET",url:"/attendees/attendanceId/".concat(e)}),this.getAttendeeDetail=e=>this.axios.request({method:"GET",url:"/attendees/".concat(e)}),this.createAttandance=e=>this.axios.request({method:"POST",url:"/attendances",data:e,headers:{"Content-Type":"multipart/form-data"}}),this.createAttendee=e=>this.axios.request({method:"POST",url:"/attendees",data:e}),this.updateAttendee=(e,t)=>this.axios.request({method:"PATCH",url:"/attendees/".concat(e),data:t}),this.createSchedules=e=>this.axios.request({method:"POST",url:"/schedules",data:e}),this.createRecords=e=>this.axios.request({method:"POST",url:"/records",data:e}),this.deleteAttendees=e=>this.axios.request({method:"DELETE",url:"/attendees",data:e}),this.getSchedulesById=e=>this.axios.request({method:"GET",url:"/attendee/".concat(e,"/schedules")})}}t.Z=s},29059:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return W}});var a=n(57437);n(57922);var s=n(54272),r=n(29835),i=n(58836),o=n(85693),l=n(2265),c=n(47907),d=n(65282),h=n(39424),u=n(25817),x=n(95749),p=n(97448),f=n(6285),g=n(90697),m=n(3891),y=n(20703),Z=n(20568),j=n(98955);let v=[{월:"MONDAY"},{화:"TUESDAY"},{수:"WEDNESDAY"},{목:"THURSDAY"},{금:"FRIDAY"},{토:"SATURDAY"},{일:"SUNDAY"}];var T=e=>{let{setIsCreate:t,attendancesRefetch:n}=e,i=j.Z.get("REFRESH_TOKEN"),o=[],c=[],[m,T]=(0,l.useState)(null),[Y,I]=(0,l.useState)(),[q,N]=(0,l.useState)();for(let e=0;e<=23;e++)for(let t=0;t<60;t+=30){let n="".concat(e<10?"0".concat(e):"".concat(e),":").concat(0===t?"00":"30");o.push(n)}for(let e=parseInt(null==q?void 0:q.availableFrom);e<=23;e++)for(let t=0;t<60;t+=30){let n="".concat(e<10?"0".concat(e):"".concat(e),":").concat(0===t?"00":"30");c.push(n)}let F=async()=>{let e=await fetch("".concat("https://checkuree.com/api/v1","/auth/refresh-token"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refreshToken:i})}).then(e=>e.json());j.Z.set("ACCESS_TOKEN",e.data.accessToken),j.Z.set("REFRESH_TOKEN",e.data.refreshToken)},{mutate:U}=(0,Z.D)({mutationKey:["attendancy-list"],mutationFn:async()=>await d.Z.getInstance().createAttandance({...q,image:Y,availableFrom:null==q?void 0:q.availableFrom.replace(":",""),availableTo:null==q?void 0:q.availableTo.replace(":","")}).then(e=>e.data),onSuccess:()=>{alert("출석부가 생성되었습니다."),n(),t(!1),F()}}),H=(0,l.useRef)(null),W=(e,t)=>{N(n=>({...n,[e]:t}))},[_,M]=(0,l.useState)(new Set),z=e=>Array.from(e).join(","),K=e=>{let t=new Set(_);t.has(e)?t.delete(e):t.add(e),M(t),W("attendanceDays",z(t))};return(0,a.jsxs)(S,{children:[(0,a.jsx)(r.Z,{fontSize:20,fontWeight:600,lineHeight:"27.24px",width:340,children:"정보 입력"}),(0,a.jsxs)(b,{sx:{},children:[(0,a.jsx)(r.Z,{fontSize:14,lineHeight:"19.07px",color:"#222222",children:"출석부 이미지"}),(0,a.jsxs)(s.Z,{sx:{display:"flex",gap:"8px",alignItems:"flex-end"},children:[m?(0,a.jsx)(y.default,{src:m,alt:"profile",width:92,height:92,style:{border:"1px solid #D5D5D5",borderRadius:"8px",objectFit:"cover",objectPosition:"center"}}):(0,a.jsx)(A,{onClick:()=>{H.current&&H.current.click()},sx:{background:"lightgray"}}),(0,a.jsx)(r.Z,{fontSize:14,lineHeight:"19.07px",color:"#C9C9C9",children:"jpg, png 형식 가능"})]})]}),(0,a.jsx)("input",{type:"file",ref:H,style:{display:"none"},onChange:e=>{var t;let n=null===(t=e.target.files)||void 0===t?void 0:t[0],a=new FileReader;a.onload=e=>{e.target&&e.target.result&&(T(e.target.result),I(n))},n&&a.readAsDataURL(n)}}),(0,a.jsxs)(E,{children:[(0,a.jsx)(k,{children:"출석부 이름"}),(0,a.jsx)(h.Z,{sx:{"&::placeholder":{fontSize:"24px",width:339}},placeholder:"출석부 이름을 입력해주세요.",inputProps:D,onChange:e=>W("title",e.target.value)}),(0,a.jsx)(k,{children:"출석부 설명"}),(0,a.jsx)(h.Z,{sx:{"&::placeholder":{fontSize:"24px",width:339}},placeholder:"출석부 설명을 입력해주세요..",inputProps:D,onChange:e=>W("description",e.target.value)})]}),(0,a.jsxs)(E,{children:[(0,a.jsx)(k,{children:"출석부 지각 사용 여부"}),(0,a.jsxs)(u.Z,{"aria-label":"gender",name:"gender1",value:null==q?void 0:q.allowLateness,row:!0,onChange:e=>{W("allowLateness",e.target.value)},sx:{display:"flex",gap:"20px"},children:[(0,a.jsx)(x.Z,{value:"Y",control:(0,a.jsx)(p.Z,{}),label:"사용함"}),(0,a.jsx)(x.Z,{value:"N",control:(0,a.jsx)(p.Z,{}),label:"사용하지 않음"})]})]}),(0,a.jsxs)(E,{children:[(0,a.jsx)(k,{children:"요일 선택"}),(0,a.jsx)(O,{children:v.map((e,t)=>(0,a.jsx)(f.Z,{tabIndex:t,sx:{border:"1px solid ".concat(_.has(Object.values(e)[0])?"#59996B":"#D5D5D5"),color:_.has(Object.values(e)[0])?"#59996B":"#C9C9C9",minWidth:"44px"},value:Object.values(e)[0],onClick:e=>{K(e.currentTarget.value)},children:Object.keys(e)[0]},t))})]}),(0,a.jsxs)(E,{children:[(0,a.jsx)(k,{children:"시간 선택"}),(0,a.jsxs)(s.Z,{sx:{display:"flex",justifyContent:"space-between"},children:[(0,a.jsx)(P,{labelId:"start-time-label",id:"start-time-select",displayEmpty:!0,value:null==q?void 0:q.availableFrom,onChange:e=>{W("availableFrom",e.target.value)},renderValue:e=>(null==e?void 0:e.length)?e:(0,a.jsx)("span",{color:"#D5D5D5",children:"시작 시간 선택"}),children:o.map(e=>(0,a.jsx)(g.Z,{value:e,children:e},e))}),(0,a.jsx)(P,{labelId:"end-time-label",id:"end-time-select",displayEmpty:!0,value:null==q?void 0:q.availableTo,disabled:(null==q?void 0:q.availableFrom)==="",onChange:e=>{W("availableTo",e.target.value)},renderValue:e=>(null==e?void 0:e.length)?e:(0,a.jsx)("span",{color:"#D5D5D5",children:"종료 시간 선택"}),children:c.map(e=>(0,a.jsx)(g.Z,{value:e,children:e},e))})]})]}),(0,a.jsxs)(R,{children:[(0,a.jsx)(C,{onClick:()=>t(!1),children:"취소"}),(0,a.jsx)(w,{onClick:()=>U(),children:"저장하기"})]})]})};let S=(0,i.ZP)(s.Z)(()=>({display:"flex",paddingTop:"43px",gap:"24px",flexDirection:"column",flexWrap:"wrap",width:"100%",alignItems:"center"})),D={style:{backgroundColor:"white",width:"339px",height:"20px",borderRadius:"8px",border:"1px solid #D5D5D5",fontSize:"16px"}},b=(0,i.ZP)(s.Z)(()=>({display:"flex",flexDirection:"column",gap:"8px",width:340})),A=(0,i.ZP)(s.Z)(()=>({width:"92px",height:"92px",border:"1px solid #D5D5D5",borderRadius:"8px",cursor:"pointer"})),E=(0,i.ZP)(s.Z)(()=>({display:"flex",flexDirection:"column",gap:"8px",width:"340px"})),k=(0,i.ZP)(r.Z)(()=>({fontSize:"14px",fontWeight:500,lineHeight:"19.07px"})),w=(0,i.ZP)(s.Z)(()=>({width:"100%",height:"60px",background:" #59996B",color:"white",display:"flex",flex:2.5,justifyContent:"space-around",alignItems:"center"})),C=(0,i.ZP)(s.Z)(()=>({width:"100%",height:"60px",background:" #C9C9C9",color:"white",display:"flex",flex:1,justifyContent:"space-around",alignItems:"center"})),R=(0,i.ZP)(s.Z)(()=>({display:"flex",maxWidth:340,width:"100%",justifyContent:"center"})),P=(0,i.ZP)(m.Z)(()=>({width:163,height:40,border:"1px solid #D5D5D5",borderRadius:"8px"})),O=(0,i.ZP)(s.Z)(()=>({display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"5px",width:"340px"}));var Y=n(89539),I=n.n(Y),q=n(73667),N=n(12181),F=n(65950),U=n(62413),H=()=>{let{data:e}=(0,q.a)({queryKey:["user"],queryFn:async()=>await U.Z.getInstance().userInfo(),retry:!1,select:e=>e.data});return e};I().locale("ko");var W=()=>{let e=(0,c.useRouter)(),t=I()().format("YYYY년 MM월 DD일 dddd"),n=H(),[i,o]=(0,l.useState)(!1),{data:h,refetch:u}=(0,q.a)({queryKey:["attendancy-list"],queryFn:async()=>(await d.Z.getInstance().getAttendanceList()).data});return(0,a.jsx)(a.Fragment,{children:(0,a.jsxs)(_,{children:[h?(0,a.jsxs)(z,{children:[(0,a.jsxs)(s.Z,{children:[(0,a.jsx)(r.Z,{fontSize:14,lineHeight:"19.07px",color:"#797979",children:t}),(0,a.jsxs)(r.Z,{fontSize:20,lineHeight:"27.24px",fontWeight:600,children:[(null==n?void 0:n.name)||"","님, 안녕하세요."]})]}),(0,a.jsxs)(M,{children:[null==h?void 0:h.items.map(t=>(0,a.jsxs)(K,{onClick:()=>e.push("/attendances/".concat(t.attendanceId)),children:[(0,a.jsx)(y.default,{src:t.attendance.imageUrl||"images/sckeleton-image.svg",width:142,height:102,alt:"스켈레톤 이미지",style:{objectFit:"cover"}}),(0,a.jsxs)(B,{children:[(0,a.jsxs)(s.Z,{children:[(0,a.jsx)(L,{children:t.attendance.title}),(0,a.jsx)(J,{children:t.attendance.description||"출석부 설명입니다."})]}),(0,a.jsxs)(s.Z,{display:"flex",alignItems:"center",justifyContent:"space-between",children:[(0,a.jsx)(V,{children:function(e){let t={MONDAY:"월",TUESDAY:"화",WEDNESDAY:"수",THURSDAY:"목",FRIDAY:"금",SATURDAY:"토",SUNDAY:"일"};return(0,F.rI)(e).map(e=>t[e]).join(", ")}(t.attendance.days)}),(0,a.jsx)(G,{children:t.attendance.attendeeCount})]})]})]},"attendance-item__".concat(t.attendanceId))),(0,a.jsx)(X,{children:(0,a.jsx)(y.default,{src:"/images/icons/add-icon.svg",alt:"",width:48,height:48,onClick:()=>o(!0)})})]})]}):(0,a.jsx)(a.Fragment,{children:"...Loading"}),(0,a.jsx)(N.Z,{open:i,onClose:()=>{},children:(0,a.jsx)(T,{setIsCreate:o,attendancesRefetch:u})})]})})};let _=(0,i.ZP)(s.Z)(()=>({display:"flex",justifyContent:"center"})),M=(0,i.ZP)(s.Z)(()=>({display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"20px",padding:"0px 9px"})),z=(0,i.ZP)(s.Z)(()=>({display:"flex",gap:"10px",flexDirection:"column",flexWrap:"wrap",paddingTop:"64px"})),K=(0,i.ZP)(s.Z)(()=>({width:"150px",height:"185px",border:"1px solid green",borderRadius:"4px",display:"flex",gap:"12px",cursor:"pointer",flexDirection:"column",alignItems:"center",padding:"4px"})),B=(0,i.ZP)(s.Z)(()=>({width:"100%",padding:"0px 7px",display:"flex",flexDirection:"column",gap:"3px"})),G=(0,i.ZP)(r.Z)(()=>({fontSize:"12px",fontWeight:500,alignItems:"center",justifyContent:"space-between",border:"1px solid #F0FFF4",lineHeight:"16.34px"})),L=(0,i.ZP)(r.Z)(()=>({fontSize:"16px",fontWeight:600,lineHeight:"21.79px",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"})),J=(0,i.ZP)(r.Z)(()=>({fontSize:"14px",fontWeight:500,color:"#797979",lineHeight:"19.07px",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"})),V=(0,i.ZP)(r.Z)(()=>({fontSize:"12px",fontWeight:500,color:"#797979",lineHeight:"16.34px"})),X=(0,i.ZP)(o.Z)(()=>({position:"fixed",bottom:24,right:24,background:"#59996B"}))},12181:function(e,t,n){"use strict";var a=n(56093),s=n(57437);n(2265);var r=n(36892),i=n(34686);function o(){let e=(0,a._)(["\n                    .MuiPaper-root {\n                        height: 95vh !important;\n                        border-top-left-radius: 32px;\n                        border-top-right-radius: 32px;\n                    }\n                "]);return o=function(){return e},e}t.Z=e=>{let{open:t,onClose:n,children:a}=e;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(i.xB,{styles:(0,i.iv)(o())}),(0,s.jsx)(r.ZP,{anchor:"bottom",open:t,onClose:n,children:a})]})}},44614:function(e,t,n){"use strict";n.d(t,{d:function(){return s},y:function(){return r}});var a=n(98955);function s(e){a.Z.set("ACCESS_TOKEN",e.accessToken),e.refreshToken&&a.Z.set("REFRESH_TOKEN",e.refreshToken)}function r(){a.Z.remove("ACCESS_TOKEN"),a.Z.remove("REFRESH_TOKEN")}},65950:function(e,t,n){"use strict";n.d(t,{n7:function(){return l},rI:function(){return c},ul:function(){return i},vc:function(){return s}});var a=n(47727);let s=(e,t)=>{switch(t){case"slash":return(0,a.WU)(e,"yyyy/MM/dd");case"dash":default:return(0,a.WU)(e,"yyyy-MM-dd");case"dot":return(0,a.WU)(e,"yyyy.MM.dd");case"fullDash":return(0,a.WU)(e,"yyyy-MM-dd HH:mm");case"fullDot":return(0,a.WU)(e,"yyyy.MM.dd HH:mm")}},r={MONDAY:"월",TUESDAY:"화",WEDNESDAY:"수",THURSDAY:"목",FRIDAY:"금",SATURDAY:"토",SUNDAY:"일"},i=e=>r[e],o=["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"],l=(e,t)=>o.indexOf(e.day)-o.indexOf(t.day);function c(e){return e.sort((e,t)=>o.indexOf(e)-o.indexOf(t))}}},function(e){e.O(0,[451,910,549,321,332,855,956,738,475,971,69,744],function(){return e(e.s=41482)}),_N_E=e.O()}]);