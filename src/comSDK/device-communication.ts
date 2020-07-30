import * as SerialPort from "serialport";

export class DeviceCommunication {
    private openedPort: SerialPort;
    private port: string;
    private baudRate: number;

    constructor(_port: string, _baudRate: number) {
        console.log('class constructor');
        this.port = _port;
        this.baudRate = _baudRate;
    }

    public connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.openedPort = new SerialPort(this.port, { baudRate: this.baudRate });
                this.openedPort.open(() => {
                    this.openedPort.on('data', (data) => this.dataProccess(data));
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    public isConnected() {
        return (this.openedPort) ? this.openedPort.isOpen : false;
    }

    public disconnect() {
        return new Promise((resolve, reject) => {
            try {
                this.openedPort.close(() => resolve())
            } catch (error) {
                reject(error);
            }
        });
    }

    private dataProccess(data: any) {
        console.log(data);
    }
}