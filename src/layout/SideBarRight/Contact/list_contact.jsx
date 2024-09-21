import "./list_contact.scss";
import ContactItem from "./ContactItem/contact_item";
function ListContact({data}) {

    
    return (
        <div className="list-contact--container">
            <ul className="list-contact">
                <ContactItem active={true} />
                <ContactItem active={true} />
                <ContactItem active={true} />
                <ContactItem active={true} />
                <ContactItem active={false} />
                <ContactItem active={false} />
                <ContactItem active={false} />
            </ul>
        </div>
    );
}

export default ListContact;