define("marketing/adapters/patient-ad-context",["exports","boot/config","common/adapters/legacy"],function(e,t,a){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=a.default.extend({buildURL:function(e,a){var n="".concat(t.default.chartingURL,"PatientAdContext/").concat(a)
return"".concat(n)}})
e.default=n}),define("marketing/adapters/provider-ad-context",["exports","boot/config","common/adapters/legacy"],function(e,t,a){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=a.default.extend({buildURL:function(){return t.default.chartingURL+"ProviderAdContext"}})
e.default=n}),define("marketing/components/ad-banner-container",["exports"],function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Component.extend({adBanner:Ember.inject.service(),responsiveService:Ember.inject.service("responsive"),adHeight:Ember.computed.alias("adBanner.adHeight"),adWidth:Ember.computed.alias("adBanner.adWidth"),adParams:Ember.computed.alias("adBanner.adParams"),adUrl:Ember.computed.alias("adBanner.url"),adUrlDidChange:Ember.observer("adUrl",function(){var e=Ember.$("#carbon-ad-frame")
e&&e[0]&&e[0].contentWindow.location.replace(this.get("adUrl"))}),init:function(){var e=this
this._super()
var t=function(t){t===e.responsiveService.breakpoints.XL?e.get("adBanner").updateFrameSize(320,600):t===e.responsiveService.breakpoints.L?e.get("adBanner").updateFrameSize(160,600):e.get("adBanner").updateFrameSize(728,90)}
this.set("onBreakpointReached",t),this.responsiveService.on("breakpointReached",t),this.responsiveService.breakpointXL.matches?t(this.responsiveService.breakpoints.XL):this.responsiveService.breakpointL.matches?t(this.responsiveService.breakpoints.L):t(),this.adUrlDidChange()},willDestroyElement:function(){this.responsiveService.off("breakpointReached",this.onBreakpointReached),this._super()}})
e.default=t}),define("marketing/components/ad-banner",["exports"],function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Component.extend({classNames:["ad-container"]})
e.default=t}),define("marketing/serializers/patient-ad-context",["exports","ember-data/serializers/rest"],function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var a=t.default.extend({primaryKey:"patientPracticeGuid",isNewSerializerAPI:!0,normalizeResponse:function(e,t,a,n,r){return this._super(e,t,{"patient-ad-context":a},n,r)}})
e.default=a}),define("marketing/serializers/provider-ad-context",["exports","ember-data/serializers/rest"],function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var a=t.default.extend({primaryKey:"providerGuid",normalizeResponse:function(e,t,a,n,r){return this._super(e,t,{"provider-ad-context":Ember.assign({},a,{providerGuid:n})},n,r)}})
e.default=a}),define("marketing/services/ad-banner",["exports","dashboard/models/provider-ad-context","dashboard/models/patient-ad-context","ember-concurrency"],function(e,t,a,n){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=["V2200","V2210","V2220","65100","65110","65120","65180"],i=["36201","36207","36252","36230","36231","36232","36233","36234","36235"],s=Ember.Service.extend(Ember.Evented,{config:Ember.inject.service(),patientService:Ember.inject.service("patient"),store:Ember.inject.service(),session:Ember.inject.service(),url:Ember.computed.reads("config.localAdHtmlURL"),adWidth:728,adHeight:90,zone:"",subzone:"",currentPatientGuid:null,currentMedication:null,urlParamSeparator:"&",adParams:"",updateAdUrl:function(e){e&&this.setProperties(e),this.get("session.isLiteUser")?this.setAdParams():this.updateAdUrlFromContext.perform()},updateAdUrlFromContext:(0,n.task)(regeneratorRuntime.mark(function e(){var t,a,r,i,s,o
return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.store.findRecord("provider-ad-context",this.get("session.providerGuid"))
case 2:if(t=e.sent,a=this.currentPatientGuid,!a){e.next=14
break}return e.next=7,(0,n.hash)({patientContext:this.store.findRecord("patient-ad-context",a),patientSummary:this.store.findRecord("patient-summary",a),clinicalData:this.patientService.loadClinicalData.perform(a)})
case 7:r=e.sent,i=r.patientContext,s=r.patientSummary,o=r.clinicalData,this.currentPatientGuid===a&&this.setAdParams(t,i,s,o),e.next=15
break
case 14:this.setAdParams(t,null,null,null)
case 15:case"end":return e.stop()}},e,this)})).restartable(),updateFrameSize:function(e,t){this.setProperties({adWidth:e,adHeight:t}),this.updateAdUrl()},getFrameSize:function(){return"".concat(this.get("adWidth"),"x").concat(this.get("adHeight"))},setAdParams:function(e,t,a,n){Ember.get(this.config,"isAdDebounceOn")&&!window.runningTests?Ember.run.debounce(this,"_setAdParams",e,t,a,n,1e3):Ember.run.scheduleOnce("afterRender",this,"_setAdParams",e,t,a,n)},_setAdParams:function(e,n,s,o){var d,c,u,m="zone=",l=[],p="".concat(moment().format("YYYYMMDDHHmmssSSS"),"0000"),f=this.get("urlParamSeparator"),h=this.get("currentMedication")||this.get("session.currentMedication")
Ember.isEmpty(this.get("zone"))?m+="main":m+={main:"main",default:"main",scheduler:"sched",charts:"chart",erx:"erx",dashboard:"dashboard",messages:"msg",labs:"labs",documents:"docs",admin:"admin",pflite:"pflite",tasks:"tasks"}[this.get("zone")],Ember.isEmpty(this.get("subzone"))||(m+="".concat(f,"subzone=").concat(this.get("subzone"))),m+="".concat(f,"ug=").concat(this.get("session.userGUID")),m+=this.getUrlParameters(e,t.default),m+=this.getUrlParameters(n,a.default),s&&!Ember.isEmpty(s.get("birthDate"))&&(u=moment.utc().diff(s.get("birthDate"),"years"),u<3?u=3:u>79&&(u=79),m+="".concat(f,"t=").concat(u)),o&&(d=Ember.get(this.config,"isSendingAllICD9andICD10CodesToAdServer")?o.diagnoses.filter(function(e){if(Ember.isEmpty(e.get("stopDate"))){var t=e.get("diagnosisCodes")||[]
return t.any(function(e){var t=e.codeSystem.toLocaleLowerCase()
return"icd9"===t||"icd10"===t})}return!1}).map(function(e){var t,a=[]
return e.get("diagnosisCodes").forEach(function(e){var n=e.codeSystem.toLocaleLowerCase()
"icd9"!==n&&"icd10"!==n||(t=e.code.split("."),t[1]?1===t[1].length&&(t[1]+="0"):t[1]="00",a.addObject(t.join("")))}),a.join()}):o.diagnoses.filter(function(e){return Ember.isPresent(e.get("code"))&&Ember.isEmpty(e.get("stopDate"))}).map(function(e){var t=e.get("code").split(".")
return t[1]?1===t[1].length&&(t[1]+="0"):t[1]="00",t.join("")}),m+="".concat(f,"dd=").concat(d.join()),c=o.medications.filter(function(e){return""!==e.get("ndc")}).map(function(e){return e.get("ndc")}),m+="".concat(f,"nn=").concat(c.join())),e&&(l=this.getBuckets(e)),n&&(l=l.concat(this.getBuckets(n)))
var b=d&&d.join()
b&&b.indexOf("V1588")>=0&&l.push("tecfidcontr"),b&&b.indexOf("26890")>=0&&l.push("tribtar"),b&&b.indexOf("47190")>=0&&l.push("jardinvcontrol"),b&&r.some(function(e){return b.indexOf(e)>=0})&&l.push("lsp"),b&&i.some(function(e){return b.indexOf(e)>=0})&&l.push("bennett"),l.length>0&&(m+="".concat(f,"buc=").concat(l.join())),Ember.isEmpty(h)||(m+="".concat(f,"cm=").concat(h)),m+="".concat(f,"sz=").concat(this.getFrameSize()).concat(f,"ord=").concat(p),this.setProperties({adParams:m,url:"".concat(Ember.get(this.config,"localAdHtmlURL"),"#ord=").concat(p)})},getUrlParameters:function(e,t){var a=this.get("urlParamSeparator"),n=""
return e&&Ember.get(t,"attributes").forEach(function(t){var r=t.name,i=e.get(r)
Ember.isEmpty(i)||("centurymark"===r&&(r="su"),"userID"===r&&(r="uid"),"specialtyID"===r&&(r="sid"),"xc"===r&&Ember.isArray(i)&&(i=i.join(",")),"buc"!==r&&(n+="".concat(a).concat(r,"=").concat(i)))}),n},getBuckets:function(e){var t=e.get("buc")
return Ember.isEmpty(t)?[]:t.split(",")}})
e.default=s}),define("marketing/templates/components/ad-banner-container",["exports"],function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"OKo6TwGl",block:'{"symbols":["&default"],"statements":[[14,1,[[23,["adHeight"]],[23,["adWidth"]],[23,["adParams"]]]]],"hasEval":false}',meta:{moduleName:"marketing/templates/components/ad-banner-container.hbs"}})
e.default=t}),define("marketing/templates/components/ad-banner",["exports"],function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"qHTg6YK3",block:'{"symbols":["adHeight","adWidth","adParams"],"statements":[[7,"div"],[11,"class","ad-content"],[9],[0,"\\n    "],[7,"div"],[11,"class","ad-label"],[9],[0,"Advertisement"],[10],[0,"\\n"],[4,"ad-banner-container",null,null,{"statements":[[0,"        "],[7,"iframe"],[11,"id","carbon-ad-frame"],[11,"title","Advertisement content"],[11,"aria-label","Advertisement"],[12,"height",[22,1,[]]],[12,"width",[22,2,[]]],[11,"scrolling","no"],[11,"tabindex","-1"],[11,"frameborder","0"],[12,"data-params",[28,[[22,3,[]]]]],[9],[0,"\\n        "],[10],[0,"\\n"]],"parameters":[1,2,3]},null],[10],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"marketing/templates/components/ad-banner.hbs"}})
e.default=t})
