import { Name } from '../interfaces/name'

/**
 * Class representing a name. A name has a first name and a last name.
 * @implements {Name}
 */
export class NameImpl implements Name {
    /**
     * Creates an instance of NameImpl.
     * @param firstName - The first name.
     * @param lastName - The last name.
     */
    constructor(
        public firstName: string,
        public lastName: string
    ) {}
}
