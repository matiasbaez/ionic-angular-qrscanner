export class Registro {

    public format: string;
    public text: string;
    public type: string;
    public icon: string;
    public created: Date;

    constructor(format: string, text: string) {
        this.format = format;
        this.text = text;

        this.created = new Date();

        this.determinateType();
    }

    private determinateType() {
        const text = this.text.substr(0, 4);

        switch (text) {
            case 'http':
                this.type = 'HTTP';
                this.icon = 'globe';
                break;

            case 'geo:':
                this.type = 'GEO';
                this.icon = 'pin';
                break;

            default:
                this.type = 'No registrado';
                this.icon = 'create';
                break;
        }
    }

}