(function() {
	//---------------------------------------------------------------------
	//---------------------------------------------------------------------
	var HangoutHack = function() {	
		this.initialize();
	}
	var p = HangoutHack.prototype;
	
	//---  V A R I A B L E S  -------------------------------------------------
	p.body;
    p.isIFrame;
    p.rate;
    p.pitch;
	//---------------------------------------------------------------------
	p.initialize = function() {
        var This = this;
        this.body = document.querySelector("body");
        this.synth = window.speechSynthesis;
        this.rate = 0.7;
        this.pitch = 1;

       
        //--------------------------------------------------
        if ( window.location !== window.parent.location ) {
            //--- may be hangout
            this.isIFrame = true;
            this.setupHangout();
        } else {
            this.isIFrame = false;
            this.setupMouseUp();
        }

        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = function(){
                This.setVoices();
            };
        }
        this.setVoices();
       // this.setupOnBodyModify();
    }
    p.setVoices = function(){
        this.voices = this.synth.getVoices();
        this.femaleVoice = this.voices[9];
        this.maleVoice = this.voices[5];
    }
    p.setupMouseUp = function(){
        var This = this;
        this.body.addEventListener("mouseup",function(e){
            if (e.shiftKey) {     
                var text = window.getSelection().toString();  
                if(text && text!=""){
                    
                    This.speak({text:text})
                }
            }
        })
    }
    p.speak = function (prop){
        var This = this;
        if (this.synth.speaking) {
            this.synth.cancel();
            clearTimeout(This.tempTimeoutId);
            clearTimeout(This.tempTimeoutId_2);
            clearTimeout(This.tempTimeoutId_3);
        }
        function tempTimer() {
            This.synth.pause();
            This.synth.resume();
            This.tempTimeoutId = setTimeout(tempTimer, 10000);
        }
        if (prop.text !== '') {
            //prop.text = prop.text.replace(/<\/?[^>]+>/ig, " , ");
            prop.text = prop.text.replace(/\./g,', ');
            prop.text = prop.text.replace(/ ,/g,', ');
            prop.text = escape(prop.text);
            prop.text = prop.text.replace(/%0A/g,', ');
            prop.text = unescape(prop.text);
            var utterThis = new SpeechSynthesisUtterance(prop.text);
            utterThis.onend = function (event) {
                //console.log('SpeechSynthesisUtterance.onend'); 
            }
            utterThis.onerror = function (event) {
                //console.error('SpeechSynthesisUtterance.onerror');
                clearTimeout(This.tempTimeoutId);
            }
            this.tempTimeoutId = setTimeout(tempTimer, 10000);
            this.tempTimeoutId_2 = setTimeout(function(){
                clearTimeout(This.tempTimeoutId);
            }, 80000);
            this.tempTimeoutId_3 = setTimeout(function(){
                This.synth.pause();
                This.synth.resume();
            }, 2000);

            if(prop.gender!=undefined){   
                if(prop.gender=="M"){
                    utterThis.voice = this.maleVoice;
                } else{                
                    utterThis.voice = this.femaleVoice;
                }
            }else{            
                utterThis.voice = this.femaleVoice;
            }
            utterThis.pitch = This.pitch;
            utterThis.rate = This.rate;
            this.synth.speak(utterThis);

        }
    } 
    p.setupOnBodyModify = function(){
        var This = this;
        this.body.addEventListener("DOMNodeInserted",function(e){
            var iframes = e.target.querySelectorAll("iframe");
            if(iframes.length>0){
                This.onHangoutIframeLoad({iframe:iframes[0]});
            }
        });
    }
    p.setupHangout = function(){        
        this.body = document.querySelector("body");
        var This = this;
        this.body.addEventListener("click",function(e, b){
            var chatArray = This.body.querySelectorAll(".TmwRj"); 
            var clickCloseChat = e.target.closest(".TmwRj");
            if(clickCloseChat!=null){   
                for (let i = 0; i < chatArray.length; i++) {
                    const element = chatArray[i];
                    if (element.innerHTML === clickCloseChat.innerHTML){
                        This.speakSingleHangoutMessage(element);
                    }
                }             
            }
        },false);
    }
	p.speakSingleHangoutMessage = function(element){
        var span = element.querySelectorAll(".KL span:not([aria-hidden='true'])");
        var textSp = "";
        for(var i = 0; i<span.length; i++ ){
            var tempSpan = span[i];
            textSp+=tempSpan.innerText+", ";
        }        
        this.speak({text:textSp, gender:"F"});
	}
	//---------------------------------------------------------------------
	window.HangoutHack = HangoutHack;
}());
var hangoutHack =  new window.HangoutHack();


