import "./list_contact.scss";
import ContactItem from "./ContactItem/contact_item";
function ListContact() {
    return (
        <div className="list-contact--container">
            <h4>Người liên hệ</h4>
            <ul className="list-contact">
               <ContactItem active={true} />
               {/* <ContactItem active={true} />
               <ContactItem active={true} />
               <ContactItem active={true} />
               <ContactItem active={false} />
               <ContactItem active={false} />
               <ContactItem active={false} /> */}
            </ul>
        </div>
    );
}

export default ListContact;