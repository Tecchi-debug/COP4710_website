// File for any helper functions/ components needed for admin panel
export function setTypeHelper(event, setFunction) {
    const type = event.target.value;
    
    if (type === "") {
        return;
    } else {
        setFunction(type);
    }
}