import "./list_suggest.scss";
import SuggestItem from "./SuggestItem/suggest_item";
function ListSuggest() {
    return (
        <div className="list-suggest--container">
            <ul className="list-suggest">
              
              <SuggestItem/>
              <SuggestItem/>
              <SuggestItem/>
              <SuggestItem/>
              <SuggestItem/>
              <SuggestItem/>
              <SuggestItem/>
              <SuggestItem/>

              
             
            </ul>
        </div>
    );
}

export default ListSuggest;