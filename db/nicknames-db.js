import { v4 } from 'uuid';

const loginData = {
    data: [],

    add(item) {
        item.id = v4();
        this.data.push(item);
    }
}


export default loginData;