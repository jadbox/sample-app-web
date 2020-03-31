(function(){

	console.log('checkSystemRequirements');
	console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

    // it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
    // if (!china) ZoomMtg.setZoomJSLib('https://source.zoom.us/1.7.2/lib', '/av'); // CDN version default
    // else ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/1.7.2/lib', '/av'); // china cdn option 
    // ZoomMtg.setZoomJSLib('http://localhost:9999/node_modules/@zoomus/websdk/dist/lib', '/av'); // Local version default, Angular Project change to use cdn version
    ZoomMtg.preLoadWasm();

    ZoomMtg.prepareJssdk();

    const SIGNATURE_ENDPOINT = 'https://mixzoom.herokuapp.com/';
    function zoomConnect(meetConfig) {
        if(!meetConfig.meetingNumber) throw new Error('need meeting id');
        console.log('getting sig', meetConfig);
        fetch(`${SIGNATURE_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    meetingNumber: meetConfig.meetingNumber, 
                    meetingData: meetConfig, 
                    role: 0 
                })
            })
            .then(result => result.json())
            .then(result=>result.signature)
            .then(response => {
                console.log('response',response);
                ZoomMtg.init({
                    leaveUrl: meetConfig.leaveUrl,
                    isSupportAV: true,
                    success: function() {
                        ZoomMtg.join({
                            signature: response,
                            apiKey: meetConfig.apiKey,
                            meetingNumber: meetConfig.meetingNumber,
                            /// userName: meetConfig.userName,
                            // Email required for Webinars
                            // userEmail: meetConfig.userEmail, 
                            // password optional; set by Host
                            // password: meetConfig.password,
                            success: function(res){
                                $('#nav-tool').hide();
                                console.log('join meeting success');
                            },
                            error: function(res) {
                                console.log(res);
                            }
                        })		
                    }
                })
        })
    }


    document.getElementById('join_meeting').addEventListener('click', function(e){
        e.preventDefault();

        if(!this.form.checkValidity()){
            alert("Enter Name and Meeting Number");
            return false;
        }

        const url = new URL(window.location.href);
        const meetingid = url.searchParams.get("meeting");

        var meetConfig = {
            apiKey: '4yaP1M0LTPCCCl0uzBe0ag',
            // apiSecret: API_SECRET,
            meetingNumber: parseInt(meetingid) || 12345672020,
            userName: document.getElementById('display_name').value,
            passWord: "",
            leaveUrl: "https://mixopinions.org",
            role: 0
        };

        zoomConnect(meetConfig);

/*
        var signature = ZoomMtg.generateSignature({
            meetingNumber: meetConfig.meetingNumber,
            apiKey: meetConfig.apiKey,
            apiSecret: meetConfig.apiSecret,
            role: meetConfig.role,
            success: function(res){
                console.log(res.result);
            }
        });

        ZoomMtg.init({
            leaveUrl: 'https://mixopinions.org',
            isSupportAV: true,
            success: function () {
                ZoomMtg.join(
                    {
                        meetingNumber: meetConfig.meetingNumber,
                        userName: meetConfig.userName,
                        signature: signature,
                        apiKey: meetConfig.apiKey,
                        userEmail: 'email@gmail.com',
                        passWord: meetConfig.passWord,
                        success: function(res){
                            $('#nav-tool').hide();
                            console.log('join meeting success');
                        },
                        error: function(res) {
                            console.log(res);
                        }
                    }
                );
            },
            error: function(res) {
                console.log(res);
            }
        });
*/
    });

})();
