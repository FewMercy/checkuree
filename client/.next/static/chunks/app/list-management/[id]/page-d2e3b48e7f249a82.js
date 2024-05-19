(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[695],{51710:function(e,n,t){Promise.resolve().then(t.bind(t,27531))},12607:function(e,n,t){"use strict";var a=t(7908),r=t(98955),s=t(44614);class i{getAccessToken(){var e;return(null===(e=this.tokens)||void 0===e?void 0:e.accessToken)?this.tokens.accessToken:r.Z.get("ACCESS_TOKEN")}getRefreshToken(){var e;return(null===(e=this.tokens)||void 0===e?void 0:e.refreshToken)?this.tokens.refreshToken:r.Z.get("REFRESH_TOKEN")}async refresh(e){let n=this.getRefreshToken();if(null!=n)try{let t=await a.Z.request({baseURL:"https://checkuree.com/api/v1",url:"/auth/refresh-token",method:"POST",data:{refreshToken:n}});return(0,s.d)({accessToken:t.data.data.accessToken,refreshToken:t.data.data.refreshToken}),a.Z.request({...e,headers:{...e.headers,Authorization:"Bearer ".concat(t.data.data.accessToken)}})}catch(e){console.error("[Refresh error]",e)}return(0,s.y)(),"/auth/signin"!==window.location.pathname&&window.location.replace("/auth/signin"),Promise.reject(Error("로그인을 연장할 수 없습니다."))}constructor(e,n){var t;this.tokens=n,this.axios=a.Z.create({baseURL:e,headers:{"Content-Type":"application/json","X-Requested-With":"XMLHttpRequest",Authorization:"Bearer ".concat(null===(t=this.tokens)||void 0===t?void 0:t.accessToken)}}),this.axios.interceptors.request.use(async e=>{let n=this.getAccessToken();return e.headers.Authorization="Bearer ".concat(n),e}),this.axios.interceptors.response.use(e=>e,async e=>{let{status:n,statusText:t,data:a,request:{responseURL:s}}=e.response;console.error("API Error => responseURL : ".concat(s," status:").concat(n," statusText:").concat(t," data:").concat(JSON.stringify(a)));let i=r.Z.get("ACCESS_TOKEN");return null!=i&&401===n?this.refresh(e.config):(401===n&&(e.config.headers.Authorization="Bearer ".concat(i)),Promise.reject(e))})}}n.Z=i},65282:function(e,n,t){"use strict";var a=t(12607);class r extends a.Z{static getInstance(){return null==this.instance&&(this.instance=new r),this.instance}constructor(e){super("https://checkuree.com/api/v1",e),this.getAttendanceList=()=>this.axios.request({method:"GET",url:"/attendances"}),this.getAttendanceDetail=e=>this.axios.request({method:"GET",url:"/attendances/".concat(e)}),this.getAttendanceSchedulesByDate=(e,n)=>this.axios.request({method:"GET",url:"/attendanceId/".concat(e,"/schedules/").concat(n)}),this.getAttendanceSummary=(e,n)=>this.axios.request({method:"GET",url:"/attendance/".concat(e,"/records/summary"),params:{attendeeIds:n}}),this.getAttendanceSummaryByDate=(e,n)=>this.axios.request({method:"GET",url:"/attendance/".concat(e,"/records/").concat(n,"/summary")}),this.getAttendeeList=e=>this.axios.request({method:"GET",url:"/attendees/attendanceId/".concat(e)}),this.getAttendeeDetail=e=>this.axios.request({method:"GET",url:"/attendees/".concat(e)}),this.createAttandance=e=>this.axios.request({method:"POST",url:"/attendances",data:e,headers:{"Content-Type":"multipart/form-data"}}),this.createAttendee=e=>this.axios.request({method:"POST",url:"/attendees",data:e}),this.updateAttendee=(e,n)=>this.axios.request({method:"PATCH",url:"/attendees/".concat(e),data:n}),this.createSchedules=e=>this.axios.request({method:"POST",url:"/schedules",data:e}),this.createRecords=e=>this.axios.request({method:"POST",url:"/records",data:e}),this.deleteAttendees=e=>this.axios.request({method:"DELETE",url:"/attendees",data:e}),this.getSchedulesById=e=>this.axios.request({method:"GET",url:"/attendee/".concat(e,"/schedules")})}}n.Z=r},27531:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return U}});var a=t(57437),r=t(2265),s=t(20703),i=t(47907),o=t(19524),c=t.n(o),d=t(2356),l=t(56093),u=t(48451);function h(){let e=(0,l._)(["\n    width: 100%;\n    padding: 0 27px;\n    position: relative;\n\n    & > .attendance-header {\n        width: 100%;\n        position: fixed;\n        top: 0;\n        padding: 42px 0 12px;\n        box-sizing: border-box;\n        background: ",";\n\n        & > .attendance-img {\n            width: 32px;\n            height: 32px;\n            border-radius: 8px;\n            background-color: ",";\n            margin-bottom: 12px;\n        }\n\n        & > .attendance-info {\n            & > .name {\n                font-size: 20px;\n                font-weight: 600;\n                color: ",";\n            }\n        }\n    }\n\n    & > .attendance-list {\n        display: flex;\n        gap: 12px;\n        flex-direction: column;\n        padding: 12px 0 120px;\n        margin-top: 125px;\n    }\n\n    & > .MuiFab-root {\n        width: 48px;\n        height: 48px;\n        position: fixed;\n        right: 24px;\n        bottom: 24px;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        border-radius: 24px;\n        box-sizing: border-box;\n        background-color: ",";\n        box-shadow: none;\n        cursor: pointer;\n\n        &:hover {\n            background-color: ",";\n        }\n    }\n"]);return h=function(){return e},e}function x(){let e=(0,l._)(["\n    & > .attendance-item__container {\n        width: 100%;\n        height: 58px;\n        padding: 9px 18px 10px;\n        border: 1px solid ",";\n        border-radius: 8px;\n        box-sizing: border-box;\n        background-color: ",";\n\n        & > .name {\n            display: flex;\n            gap: 4px;\n            align-items: center;\n            font-weight: 500;\n        }\n\n        & > .bottom-container {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n\n            & > div {\n                font-size: 12px;\n                font-weight: 500;\n                color: ",";\n            }\n\n            & > .status-container {\n                display: flex;\n                gap: 4px;\n\n                & > .status {\n                    display: flex;\n                    gap: 2px;\n                    align-items: center;\n\n                    & > .count {\n                        line-height: 14.34px;\n                    }\n                }\n            }\n        }\n    }\n"]);return x=function(){return e},e}function p(){let e=(0,l._)(["\n    height: 786px;\n    overflow: auto;\n\n    & > form {\n        width: 100%;\n        display: flex;\n        flex-direction: column;\n        gap: 24px;\n        padding: 32px 27px 36px;\n        margin-bottom: 60px;\n\n        & > .form-row {\n            & > .label {\n                font-size: 14px;\n                font-weight: 500;\n                margin-bottom: 8px;\n            }\n\n            & > .value {\n                z-index: 1;\n\n                & > .calendar-input {\n                    width: 100%;\n                    height: 40px;\n                    padding: 8px 13px;\n                    border: 1px solid ",";\n                    border-radius: 8px;\n                    box-sizing: border-box;\n\n                    & > span {\n                        color: ",";\n                    }\n                }\n\n                & > .MuiFormControl-root > .MuiFormGroup-root {\n                    display: flex;\n                    flex-direction: row;\n\n                    & .MuiFormControlLabel-root {\n                        height: 22px;\n                        gap: 8px;\n                        margin-left: 0;\n\n                        &:first-of-type {\n                            margin-right: 66px;\n                        }\n\n                        & .MuiRadio-root {\n                            width: 18px;\n                            height: 18px;\n                            padding: 0;\n                        }\n                    }\n                }\n            }\n        }\n\n        & > .days-times-container {\n            & > .days-container {\n                display: flex;\n                gap: 6px;\n                margin-bottom: 4px;\n\n                & > .day {\n                    height: 40px;\n                    flex: 1;\n                    border-radius: 8px;\n                    border: 1px solid ",";\n                    font-weight: 500;\n                    text-align: center;\n                    line-height: 40px;\n                    color: ",";\n                }\n\n                & > .selected {\n                    border: 1px solid ",";\n                    color: ",";\n                    background: ",";\n                }\n            }\n\n            & > .time-container {\n                height: 164px;\n                display: flex;\n                padding: 12px 12px 0;\n                border-radius: 8px;\n                box-sizing: border-box;\n                border: 1px solid ",";\n\n                & > .selected-times {\n                    display: flex;\n                    flex: 1;\n                    gap: 6px;\n                    flex-direction: column;\n                    padding: 0 12px 12px 0;\n                    box-sizing: border-box;\n                    border-right: 1px solid ",";\n                    overflow-y: auto;\n\n                    & > .selected-time {\n                        height: 30px;\n                        display: flex;\n                        align-items: center;\n                        justify-content: space-between;\n                        padding: 4px 11px 4px 15px;\n                        box-sizing: border-box;\n                        border-radius: 15px;\n                        border: 1px solid ",";\n                        color: ",";\n                        background: ",";\n                    }\n                }\n\n                & > .time-options {\n                    flex: 1.8;\n                    padding: 0 16px 0 12px;\n                    box-sizing: border-box;\n                    overflow-y: auto;\n\n                    & > .time-option {\n                        height: 40px;\n                        display: flex;\n                        align-items: center;\n                        justify-content: space-between;\n                        border-bottom: 1px solid ",";\n                        font-weight: 500;\n                        color: ",";\n\n                        &:last-child {\n                            border-bottom: none;\n                        }\n                    }\n\n                    & > .selected {\n                        color: ",";\n                    }\n                }\n            }\n        }\n\n        & > .additional-button-container {\n            display: flex;\n            justify-content: space-between;\n\n            & > .additional-button {\n                height: 28px;\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                padding: 0 12px;\n                box-sizing: border-box;\n                border-radius: 4px;\n                border: 1px solid ",";\n                font-weight: 500;\n                color: ",";\n                background: ",";\n            }\n        }\n\n        & > .disabled-button {\n            height: 40px;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            border-radius: 4px;\n            font-weight: 600;\n            color: ",";\n            background: ",";\n        }\n    }\n\n    & > .button-container {\n        width: 100%;\n        height: 60px;\n        display: flex;\n        position: absolute;\n        bottom: 0;\n\n        & > .button {\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            font-weight: 600;\n            color: ",";\n        }\n\n        & > .cancel {\n            flex: 1;\n            background-color: ",";\n        }\n\n        & > .confirm {\n            flex: 2.5;\n            border: none;\n            font-size: 16px;\n            background-color: ",";\n        }\n    }\n"]);return p=function(){return e},e}function m(){let e=(0,l._)(["\n    position: fixed;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n\n    & .react-calendar {\n        border-radius: 8px;\n\n        & .react-calendar__month-view__days__day--weekend {\n            color: ",";\n        }\n\n        & .react-calendar__tile--now {\n            background: none;\n        }\n\n        & .react-calendar__tile--active,\n        .react-calendar__tile--active:enabled:hover,\n        .react-calendar__tile--active:enabled:focus {\n            font-weight: 600;\n            background: ",";\n        }\n    }\n"]);return m=function(){return e},e}let f=u.Z.section(h(),d.wL.White,d.wL.Gray40,d.wL.Black01,d.wL.CheckureeGreen,d.wL.CheckureeGreen),g=u.Z.div(x(),d.wL.CheckureeGreen,d.wL.White,d.wL.Gray80),b=u.Z.section(p(),d.wL.Gray50,d.wL.Gray60,d.wL.Gray60,d.wL.Gray60,d.wL.CheckureeGreen,d.wL.CheckureeGreen,d.wL.CheckureeGreen10,d.wL.Gray60,d.wL.Gray60,d.wL.CheckureeGreen,d.wL.CheckureeGreen,d.wL.CheckureeGreen10,d.wL.Gray60,d.wL.Gray60,d.wL.CheckureeGreen,d.wL.CheckureeGreen,d.wL.CheckureeGreen,d.wL.CheckureeGreen10,d.wL.White,d.wL.WarningRed,d.wL.White,d.wL.Gray60,d.wL.CheckureeGreen),y=u.Z.div(m(),d.wL.WarningRed,d.wL.CheckureeGreen);var w=t(94642),v=t(65282),k=t(85693),j=t(25251),A=t(12181),L=t(65950),E=e=>{let{item:n,setIsUpdateOpen:t}=e,s=[{icon:"sentiment_satisfied_alt",count:n.presentCount},{icon:"watch_later",count:n.lateCount},{icon:"highlight_off",count:n.absenceCount}],i={MONDAY:"월",TUESDAY:"화",WEDNESDAY:"수",THURSDAY:"목",FRIDAY:"금",SATURDAY:"토",SUNDAY:"일"},[o,l]=(0,r.useState)("");return(0,r.useEffect)(()=>{if(!c().isEmpty(n.schedules)){let e=[];n.schedules.sort(L.n7),n.schedules.forEach(n=>{let t=i[n.day];e.includes(t)||e.push(t)}),l(e.join(", "))}},[n.schedules]),(0,a.jsx)(g,{children:(0,a.jsxs)("div",{className:"attendance-item__container",onClick:()=>{t(n.id)},children:[(0,a.jsx)("div",{className:"name",children:n.name}),(0,a.jsxs)("div",{className:"bottom-container",children:[(0,a.jsx)("div",{className:"days",children:o}),(0,a.jsx)("div",{className:"status-container",children:s.map(e=>(0,a.jsxs)("div",{className:"status",children:[(0,a.jsx)(j.Z,{icon:d.PJ[e.icon],color:d.wL.Gray80,size:16}),(0,a.jsx)("div",{className:"count",children:e.count})]},e.icon))})]})]})},"attendance-item__".concat(n.id))},_=t(82670),N=t(9099);t(79865);var S=t(53098),C=t(39424),D=t(10698),G=t(25817),T=t(95749),Z=t(97448),M=t(47082),Y=t(20568),I=e=>{let{watch:n,attendeeId:t,attendanceId:a,onClose:r}=e,s=(0,M.NL)(),{data:i,isSuccess:o}=(0,w.a)({queryKey:["attendee-detail",t],queryFn:async()=>{let e=await v.Z.getInstance().getAttendeeDetail(t||"");return 200===e.status&&c().has(e,"data")&&c().has(e.data,"data")?e.data.data:{}},enabled:!!t&&t.length>0}),{mutate:d}=(0,Y.D)({mutationFn:async e=>(await v.Z.getInstance().createAttendee(e)).data,onSuccess:async e=>{let t=n("times"),r=[];Object.keys(t).forEach(e=>{t[e].forEach(n=>{r.push({day:e,time:n})})}),u({attendanceId:a,attendeeId:e.data.id,singleSchedules:r})}}),{mutate:l}=(0,Y.D)({mutationFn:async e=>{let{attendeeId:n,parameters:t}=e;return(await v.Z.getInstance().updateAttendee(n,t)).data},onSuccess:async e=>{let t=n("times"),i=[];if(Object.keys(t||{}).forEach(e=>{t[e].forEach(n=>{i.push({day:e,time:n})})}),void 0===t||!i.length){await s.invalidateQueries({queryKey:["attendee-list"]}),await s.invalidateQueries({queryKey:["attendee-detail"]}),r();return}u({attendanceId:a,attendeeId:e.data.id,singleSchedules:i})}}),{mutate:u}=(0,Y.D)({mutationFn:async e=>(await v.Z.getInstance().createSchedules(e)).data,onSuccess:()=>{Promise.all([s.invalidateQueries({queryKey:["attendee-list"]}),s.invalidateQueries({queryKey:["attendee-detail"]})]),r()}}),{mutate:h}=(0,Y.D)({mutationKey:["deleteAttendees"],mutationFn:async e=>v.Z.getInstance().deleteAttendees(e),onSuccess:async()=>{r(),await s.invalidateQueries({queryKey:["attendee-list"]})}});return{attendeeDetail:i,isSuccess:o,createAttendee:d,updateAttendee:l,deleteAttendees:h,generateTimeOptions:function(){let e=[];for(let n=0;n<24;n++)for(let t=0;t<60;t+=30){let a="".concat(n.toString().padStart(2,"0"),":").concat(t.toString().padStart(2,"0")),r=(100*n+t).toString().padStart(4,"0");e.push({label:a,value:r})}return e}}};function F(){let e=(0,l._)(["\n    display: flex;\n    gap: 24px;\n    flex-direction: column;\n    align-items: center;\n    padding: 24px;\n    border-radius: 8px;\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    background-color: ",";\n\n    & > .schedule-modal-content-box {\n        display: flex;\n        gap: 12px;\n        flex-direction: column;\n\n        & > .title {\n            font-size: 16px;\n            font-weight: 600;\n        }\n\n        & > .schedules-table {\n            display: flex;\n            border-radius: 8px;\n            overflow: hidden;\n            border: 1px solid ",";\n\n            & > .schedules-table__column {\n                min-width: 43px;\n                display: flex;\n                flex-direction: column;\n                border-right: 1px solid ",";\n\n                &:last-of-type {\n                    border-right: none;\n                }\n\n                & > .schedules-table__header {\n                    padding: 2.5px 15px;\n                    border-bottom: 1px solid ",";\n                    font-size: 14px;\n                    font-weight: 500;\n                    text-align: center;\n                    color: ",";\n                    background-color: ",";\n                }\n\n                & > .schedules-table__body {\n                    min-height: 76px;\n                    height: fit-content;\n                    display: flex;\n                    gap: 4px;\n                    flex-direction: column;\n                    padding: 4px;\n\n                    & > .schedules-table__body-cell {\n                        padding: 2px;\n                        border-radius: 4px;\n                        border: 1px solid ",";\n                        font-size: 12px;\n                        font-weight: 500;\n                        color: ",";\n                        background-color: ",";\n                    }\n                }\n            }\n        }\n    }\n\n    & > .closeBtn {\n        width: 90px;\n        height: 40px;\n        border: none;\n        border-radius: 4px;\n        padding: 10.5px 32px;\n        font-size: 14px;\n        font-weight: 500;\n        color: ",";\n        background-color: ",";\n    }\n"]);return F=function(){return e},e}function O(e){let{attendeeId:n,onClose:t}=e,{data:r}=(0,w.a)({queryKey:["attendee-schedules-all",n],queryFn:async()=>{let e=await v.Z.getInstance().getSchedulesById(n);if(200===e.status&&e.data.success&&e.data.items.length>0){let n={MONDAY:[],TUESDAY:[],WEDNESDAY:[],THURSDAY:[],FRIDAY:[],SATURDAY:[],SUNDAY:[]};return e.data.items.forEach(e=>{n[e.day]=n[e.day].concat(e.time)}),n}return{}}});return(0,a.jsxs)(q,{children:[(0,a.jsxs)("section",{className:"schedule-modal-content-box",children:[(0,a.jsx)("div",{className:"title",children:"시간표 전체 보기"}),(0,a.jsx)("section",{className:"schedules-table",children:Object.keys(r||{}).map(e=>(0,a.jsxs)("div",{className:"schedules-table__column",children:[(0,a.jsx)("div",{className:"schedules-table__header",children:(0,L.ul)(e)}),(0,a.jsx)("div",{className:"schedules-table__body",children:r&&r[e].map(e=>(0,a.jsx)("div",{className:"schedules-table__body-cell",children:"".concat(e.substring(0,2),":").concat(e.substring(2,4))}))})]}))})]}),(0,a.jsx)("button",{className:"closeBtn",onClick:t,children:"닫기"})]})}let q=u.Z.section(F(),d.wL.White,d.wL.CheckureeGreen,d.wL.CheckureeGreen,d.wL.CheckureeGreen,d.wL.CheckureeGreen,d.wL.CheckureeGreen10,d.wL.CheckureeGreen,d.wL.CheckureeGreen,d.wL.CheckureeGreen10,d.wL.White,d.wL.Gray60);var R=e=>{let{data:n,attendeeId:t,attendanceId:s,onClose:i}=e,[o,l]=(0,r.useState)(!1),[u,h]=(0,r.useState)((null==n?void 0:n.days[0])||""),[x,p]=(0,r.useState)([]),[m,f]=(0,r.useState)(!1),{watch:g,register:w,handleSubmit:v,setValue:k,reset:A,formState:{errors:E}}=(0,_.cI)({defaultValues:{gender:"MALE"},mode:"onSubmit",reValidateMode:"onSubmit"}),{attendeeDetail:M,isSuccess:Y,createAttendee:F,updateAttendee:q,deleteAttendees:R,generateTimeOptions:U}=I({watch:g,attendeeId:t,attendanceId:s,onClose:i}),z=v(e=>{let{times:n,schedules:a,...r}=e;s&&(t?q({attendeeId:t,parameters:{...r,attendanceId:s}}):F({...r,attendanceId:s}))}),W={MONDAY:"월",TUESDAY:"화",WEDNESDAY:"수",THURSDAY:"목",FRIDAY:"금",SATURDAY:"토",SUNDAY:"일"},P=(e,n)=>{let t=g("times")||{},a=c().has(t,e)?t[e].indexOf(n):-1;-1!==a?t[e].splice(a,1):(c().has(t,e)||Object.assign(t,{[e]:[]}),t[e].push(n)),k("times",t)};return(0,r.useEffect)(()=>{if(Y&&M){let e={};M.schedules.forEach(n=>{let{day:t,time:a}=n;e[t]=Array.isArray(e[t])?e[t].concat(a):[a]}),A({...M,times:e})}},[Y,M]),(0,r.useEffect)(()=>{if(n&&(null==n?void 0:n.availableFrom)&&(null==n?void 0:n.availableTo)){let e=60*parseInt(n.availableFrom.substring(0,2))+parseInt(n.availableFrom.substring(2)),t=60*parseInt(n.availableTo.substring(0,2))+parseInt(n.availableTo.substring(2));p(U().filter(n=>{let a=60*parseInt(n.value.substring(0,2))+parseInt(n.value.substring(2));return a>=e&&a<=t}))}if(n&&n.days&&!M){let e={};n.days.forEach(n=>{Object.assign(e,{[n]:[]})}),k("times",e)}},[n]),(0,a.jsxs)(b,{gender:g("gender"),children:[t&&(0,a.jsx)(S.Z,{open:o,onClose:()=>l(!1),"aria-labelledby":"전체 스케쥴보기 모달","aria-describedby":"전체 스케쥴보기 모달",children:(0,a.jsx)(O,{attendeeId:t,onClose:()=>l(!1)})}),(0,a.jsxs)("form",{id:"create-attendees",onSubmit:z,children:[(0,a.jsxs)("div",{className:"form-row",children:[(0,a.jsx)("div",{className:"label",children:"이름"}),(0,a.jsx)("div",{className:"value",children:(0,a.jsx)(C.Z,{...w("name")})})]}),(0,a.jsxs)("div",{className:"form-row",children:[(0,a.jsx)("div",{className:"label",children:"성별"}),(0,a.jsx)("div",{className:"value",children:(0,a.jsx)(D.Z,{children:(0,a.jsxs)(G.Z,{defaultValue:"MALE","aria-labelledby":"gender-radio-buttons-group-label",name:"radio-buttons-group",children:[(0,a.jsx)(T.Z,{value:"MALE",control:(0,a.jsx)(Z.Z,{...w("gender"),checked:"MALE"===g("gender"),sx:{color:"MALE"===g("gender")?d.wL.CheckureeGreen:d.wL.Gray60,"&.Mui-checked":{color:"MALE"===g("gender")?d.wL.CheckureeGreen:d.wL.Gray60},"&.MuiFormControlLabel-label":{color:d.wL.Gray60}}}),label:"남"}),(0,a.jsx)(T.Z,{value:"FEMALE",control:(0,a.jsx)(Z.Z,{...w("gender"),checked:"FEMALE"===g("gender"),sx:{color:"FEMALE"===g("gender")?d.wL.CheckureeGreen:d.wL.Gray60,"&.Mui-checked":{color:"FEMALE"===g("gender")?d.wL.CheckureeGreen:d.wL.Gray60},"&.MuiFormControlLabel-label":{color:d.wL.Gray60}}}),label:"여"})]})})})]}),(0,a.jsxs)("div",{className:"form-row",children:[(0,a.jsx)("div",{className:"label",children:"생년월일"}),(0,a.jsxs)("div",{className:"value",children:[(0,a.jsx)("div",{className:"calendar-input",onClick:()=>f(!0),children:g("birth")?(0,L.vc)(new Date(g("birth")),"slash"):(0,a.jsx)("span",{children:"YYYY/MM/DD"})}),(0,a.jsx)(S.Z,{open:m,onClose:()=>f(!1),children:(0,a.jsx)(y,{children:(0,a.jsx)(N.ZP,{value:g("birth"),onChange:e=>{e&&e instanceof Date&&k("birth",(0,L.vc)(e,"dash")),f(!1)}})})})]})]}),(0,a.jsxs)("div",{className:"form-row",children:[(0,a.jsx)("div",{className:"label",children:"핸드폰 번호"}),(0,a.jsx)("div",{className:"value",children:(0,a.jsx)(C.Z,{...w("mobileNumber")})})]}),(0,a.jsxs)("div",{className:"form-row",children:[(0,a.jsx)("div",{className:"label",children:"보호자 핸드폰 번호"}),(0,a.jsx)("div",{className:"value",children:(0,a.jsx)(C.Z,{...w("subMobileNumber")})})]}),(0,a.jsxs)("div",{className:"days-times-container",children:[(0,a.jsx)("div",{className:"days-container",children:(0,L.rI)(null==n?void 0:n.days).map(e=>(0,a.jsx)("div",{className:"day ".concat(u===e?"selected":""),onClick:()=>h(e),children:W[e]},e))}),(0,a.jsxs)("div",{className:"time-container",children:[(0,a.jsx)("div",{className:"selected-times",children:g("times")&&c().has(g("times"),u)&&g("times")[u].map(e=>(0,a.jsxs)("div",{className:"selected-time",children:["".concat(e.slice(0,2),":").concat(e.slice(2)),(0,a.jsx)(j.Z,{icon:d.PJ.highlight_off,size:20,color:d.wL.CheckureeGreen,onClick:()=>P(u,e)})]}))}),(0,a.jsx)("div",{className:"time-options",children:x.map(e=>{let n=g("times")&&c().has(g("times"),u)&&g("times")[u].includes(e.value);return(0,a.jsxs)("div",{className:"time-option ".concat(n?"selected":""),onClick:()=>P(u,e.value),children:[e.label,(0,a.jsx)(j.Z,{icon:d.PJ[n?"check_circle":"radio_button_unchecked"],size:20,color:n?d.wL.CheckureeGreen:d.wL.Gray60})]})})})]})]}),t&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("section",{className:"additional-button-container",children:[(0,a.jsx)("div",{className:"additional-button",onClick:()=>l(!0),children:"전체 스케줄보기"}),(0,a.jsx)("div",{className:"additional-button",children:"출석 히스토리"})]}),(0,a.jsx)("div",{className:"disabled-button",onClick:()=>{confirm("출석대상을 삭제하시겠습니까?")&&R({ids:t?[t]:[""],attendanceId:s})},children:"비활성화"})]})]}),(0,a.jsxs)("section",{className:"button-container",children:[(0,a.jsx)("div",{className:"button cancel",onClick:i,children:"취소"}),(0,a.jsx)("button",{type:"submit",className:"button confirm",form:"create-attendees",children:"저장"})]})]})},U=()=>{let e=(0,i.usePathname)().split("/")[2],[n,t]=(0,r.useState)([]),[o,l]=(0,r.useState)(!1),[u,h]=(0,r.useState)(""),{data:x=[],isSuccess:p}=(0,w.a)({queryKey:["attendee-list",e],queryFn:async()=>{let n=await v.Z.getInstance().getAttendeeList(e);return 200===n.status&&c().has(n.data,"items")?(n.data.items||[]).map(e=>({...e,status:"",isDetailOpen:!1})):[]}}),{data:m={}}=(0,w.a)({queryKey:["attendance-detail",e],queryFn:async()=>{let n=await v.Z.getInstance().getAttendanceDetail(e);return 200===n.status&&c().has(n,"data")&&c().has(n.data,"data")?n.data.data:{}}}),{data:g}=(0,w.a)({queryKey:["attendance-summary",e],queryFn:async()=>{let n=x.map(e=>e.id),t=await v.Z.getInstance().getAttendanceSummary(e,n);return 200===t.status&&c().has(t,"data")?t.data:[]},enabled:x&&(null==x?void 0:x.length)>0&&p}),b=()=>{if(o){l(!1);return}h("")};return(0,r.useEffect)(()=>{x&&Array.isArray(x)&&(null==x?void 0:x.length)>0&&t(x)},[x]),(0,a.jsxs)(f,{children:[(0,a.jsxs)("section",{className:"attendance-header",children:[(0,a.jsx)("div",{className:"attendance-img",children:m.imageUrl?(0,a.jsx)(s.default,{src:m.imageUrl,alt:"attendance-image",width:32,height:32}):null}),(0,a.jsx)("section",{className:"attendance-info",children:(0,a.jsx)("div",{className:"name",children:m.title})})]}),(0,a.jsx)("section",{className:"attendance-list",children:n&&n.length>0?g&&n.map((e,n)=>(0,a.jsx)(E,{item:{...e,...g[n]},setIsUpdateOpen:h},"attendance-item__".concat(e.id))):"출석 대상이 없습니다."}),(0,a.jsx)(k.Z,{color:"primary","aria-label":"add",onClick:()=>l(!0),children:(0,a.jsx)(j.Z,{icon:d.PJ.add,size:32,color:d.wL.White})}),(0,a.jsx)(A.Z,{open:o||u.length>0,onClose:b,children:(0,a.jsx)(R,{data:m,attendeeId:u,attendanceId:e,onClose:b})})]})}},12181:function(e,n,t){"use strict";var a=t(56093),r=t(57437);t(2265);var s=t(36892),i=t(34686);function o(){let e=(0,a._)(["\n                    .MuiPaper-root {\n                        height: 95vh !important;\n                        border-top-left-radius: 32px;\n                        border-top-right-radius: 32px;\n                    }\n                "]);return o=function(){return e},e}n.Z=e=>{let{open:n,onClose:t,children:a}=e;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(i.xB,{styles:(0,i.iv)(o())}),(0,r.jsx)(s.ZP,{anchor:"bottom",open:n,onClose:t,children:a})]})}},25251:function(e,n,t){"use strict";t.d(n,{Z:function(){return l}});var a=t(57437),r=t(40663),s=t(56093),i=t(48451),o=t(2356);function c(){let e=(0,s._)(["\n    font-family: 'Material Icons Outlined', serif;\n    font-size: ","!important;\n    color: ",";\n    display: grid;\n    place-items: center;\n"]);return c=function(){return e},e}let d=i.Z.span(c(),e=>e.size?"".concat(e.size,"px"):"24px",e=>e.color?e.color:o.wL.Black01);var l=e=>{let{icon:n,size:t,color:s,cns:i,onClick:o}=e;return(0,a.jsx)(d,{className:(0,r.cx)("common-icon ".concat((null==n?void 0:n.type)||"material-icons-outlined"),i),size:t,color:s,"aria-disabled":!0,onClick:o,children:null==n?void 0:n.src})}},44614:function(e,n,t){"use strict";t.d(n,{d:function(){return r},y:function(){return s}});var a=t(98955);function r(e){a.Z.set("ACCESS_TOKEN",e.accessToken),e.refreshToken&&a.Z.set("REFRESH_TOKEN",e.refreshToken)}function s(){a.Z.remove("ACCESS_TOKEN"),a.Z.remove("REFRESH_TOKEN")}},2356:function(e,n,t){"use strict";t.d(n,{wL:function(){return a},PJ:function(){return r},rU:function(){return s}});let a={CheckureeGreen:"#59996B",CheckureeGreen10:"#F0FFF4",LightGreen:"#EDF9E3",Orange:"#EDC588",WarningRed:"#DE6161",Red:"#E9B3B3",White:"#ffffff",Black01:"#222222",Gray80:"#8E8E8E",Gray60:"#C9C9C9",Gray50:"#D5D5D5",Gray40:"#D9D9D9"},r={groups:{src:"groups",type:"material-icons-outlined"},sentiment_satisfied_alt:{src:"sentiment_satisfied_alt",type:"material-icons-outlined"},watch_later:{src:"watch_later",type:"material-icons-outlined"},highlight_off:{src:"highlight_off",type:"material-icons-outlined"},add:{src:"add",type:"material-icons-outlined"},radio_button_unchecked:{src:"radio_button_unchecked",type:"material-icons-outlined"},check_circle:{src:"check_circle",type:"material-icons-outlined"}},s={Logo:{src:"/_next/static/media/checkuree_logo.28b15375.svg",height:25,width:137,blurWidth:0,blurHeight:0},DetailOpen:{src:"/_next/static/media/ico-detail-open.e1062311.svg",height:12,width:12,blurWidth:0,blurHeight:0}}},65950:function(e,n,t){"use strict";t.d(n,{n7:function(){return c},rI:function(){return d},ul:function(){return i},vc:function(){return r}});var a=t(47727);let r=(e,n)=>{switch(n){case"slash":return(0,a.WU)(e,"yyyy/MM/dd");case"dash":default:return(0,a.WU)(e,"yyyy-MM-dd");case"dot":return(0,a.WU)(e,"yyyy.MM.dd");case"fullDash":return(0,a.WU)(e,"yyyy-MM-dd HH:mm");case"fullDot":return(0,a.WU)(e,"yyyy.MM.dd HH:mm")}},s={MONDAY:"월",TUESDAY:"화",WEDNESDAY:"수",THURSDAY:"목",FRIDAY:"금",SATURDAY:"토",SUNDAY:"일"},i=e=>s[e],o=["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"],c=(e,n)=>o.indexOf(e.day)-o.indexOf(n.day);function d(e){return e.sort((e,n)=>o.indexOf(e)-o.indexOf(n))}}},function(e){e.O(0,[866,451,910,549,321,332,615,956,648,971,69,744],function(){return e(e.s=51710)}),_N_E=e.O()}]);