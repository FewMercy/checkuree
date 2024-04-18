import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { RoleType } from './role-type.enum';
export declare class Role extends BaseTimeEntity {
    id: string;
    name: string;
    type: RoleType;
}
