Guys if you are working on following some tutorials. 
I kindly suggest you install npm install react-router-dom@5.3.0 
After you master routing you can use the latest version


.ENV IS TO BE UNIVERSAL WHEN IT COMES ON CALLING THE API AND YOU WILL NOT HAVE TO CHANGE IT EVERY TIME
NOTE: This import.meta.env.VITE_REACT_API_URL
basepath ex VITE_REACT_API_URL="http://localhost:8001"

to prevent in double data requests
remove react strict mode 


//MRT_EditRowModal
MRT_EditActionButtons
mrt_tableroots




       <Button_lex
                variant="success"
                className="btn-component mx-1"
                title="Save"
                size="lg"
                onClick={() => {
                  window.shownoModalDialog(
                    // `http://localhost:8000/print/${case_id}`,
                    "",
                    "",
                    "dialogtop:50; dialogleft: 230; center:1; dialogwidth:790; dialogheight:570; scroll:0; resizable:1"
                  );
                }}
              >
                <span className="d-flex justify-content-around">
                  {/* <SaveIcon /> */}
                  Print
                </span>
              </Button_lex>