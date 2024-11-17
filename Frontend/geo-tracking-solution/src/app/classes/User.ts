export default interface User {
    id: number;
    username: string;
    group: string;
    location: { longitude: number, latitude: number };
}