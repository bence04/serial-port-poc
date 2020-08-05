import * as SerialPort from "serialport";
import { config } from "./config";
import { interval, Observable } from 'rxjs';
import { bufferCount, buffer } from 'rxjs/operators';

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
                    this.dataProccess();
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    public startDaq(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.sendCommand('start_daq');
                resolve();
            } catch (error) {
                reject(error)
            }
        });
    }

    public isConnected(): boolean {
        return (this.openedPort) ? this.openedPort.isOpen : false;
    }

    public disconnect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.openedPort.close(() => resolve())
            } catch (error) {
                reject(error);
            }
        });
    }

    private sendCommand(command: string): void {
        if (this.isConnected()) {
            this.openedPort.write(command);
        } else {
            throw new Error("No connected device");
        }
    }

    private dataProccess(): void {
        const subscribe = Observable.create((obs: any) => this.openedPort.on('data', data => obs.next(data))).pipe(
            bufferCount(2)
        ).subscribe((val: any) =>
            console.log('Buffered Values:', val)
        );
    }

    convert(dataArr: any) {
        /* console.log('____');
        console.log(dataArr[0]);
        const length = dataArr.length;
        console.log(length);

        const buffer = Buffer.from(dataArr);

        console.log(buffer.readUInt32BE(0));
 */

       /*  let Uint8Arr = new Uint8Array(4);

        Uint8Arr[0] = 0x12;
        Uint8Arr[1] = 0x19;
        Uint8Arr[2] = 0x21;
        Uint8Arr[3] = 0x47;

        let buffer = Buffer.from(Uint8Arr); */

        // save in temp array
        // subscribe to observable (osb in sdk, subscribe in component)
        // rxjs buffer, buffercount, minden subjectbe -> sok pipe
        const uint32array = new Uint32Array(dataArr);

        console.log(uint32array);
        return 'buffer';
    }
}