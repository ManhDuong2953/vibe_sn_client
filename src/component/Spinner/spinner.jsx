import "./spinner.scss";
function Spinner() {
    return ( 
        <div id="spinner-container">
             {/* <div className="spinner"></div> */}
             <img onError={(e) => { e.target.src = "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png"; }}src="https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!bw700" alt="" />
        </div>
     );
}

export default Spinner;