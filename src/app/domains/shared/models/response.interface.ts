import { User } from "../../../services/admin/data.service";

export interface ResponseI{

    id_card: number;
    number: string;
    cvc: string;
    expiration_date: string;
    id_user_fk: number;
    users: User;

}