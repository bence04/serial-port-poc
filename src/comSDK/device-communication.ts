import * as SerialPort from "serialport";
import { config } from "./config";
import { interval, Observable, Subject } from 'rxjs';
import { bufferCount, buffer, reduce, map } from 'rxjs/operators';

export class DeviceCommunication {
    private openedPort: SerialPort;
    private port: string;
    private baudRate: number;
    private callback: (data: any) => void;

    constructor(_port: string, _baudRate: number, _callback: (data: any) => void) {
        console.log('class constructor');
        this.port = _port;
        this.baudRate = _baudRate;
        this.callback = _callback;
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

    private bufferToArray(bufferArr: any) {
        return Object.keys(bufferArr).map((index) => {
            return bufferArr[index];
        });
    }

    private dataProccess(): void {
        const store = new Subject();
        const kovi = new Subject();

        this.openedPort.on('data', data => store.next(this.bufferToArray(data)));

        store.pipe(
            reduce((acc, curr: any[]) => {
                let sliced = [];
                if (acc.length === 0) {
                    sliced = this.sliceArray(curr, config.PACKET_SIZE);
                } else {
                    sliced = this.sliceArray(acc.concat(curr), config.PACKET_SIZE);
                }

                for (const slice of sliced) {
                    if (slice.length === config.PACKET_SIZE) {
                        kovi.next(slice);
                    } else {
                        return slice;
                    }
                }
                return [];

            }, []),
        ).subscribe();


        kovi.pipe(
            map((data: any[]) => {
                /* const returnData = [];
                returnData[0] = String.fromCharCode(data[0]);
                returnData[1] = String.fromCharCode(data[1]);
                return returnData; */
                return data;
            }),
            bufferCount(config.PACKETS_IN_BLOCK)
        ).subscribe(x => {
            this.callback(x);
        });
    }

    private sliceArray(array: any[], columnLength: number) {
        return Array.from(
            { length: Math.ceil(array.length / columnLength) },
            (_, i) => array.slice(i * columnLength, i * columnLength + columnLength)
        )
    }

    private checkChecksum(array: any[]) {
        // TODO CHEKCUM
    }
    private calcECG(array: any[]) {
        // TODO ECG
    }
    private calcEGG(array: any[]) {
        // TODO EGG
    }
    private calcTemp(array: any[]) {
        // TODO temp
    }
    private calcSPO2(array: any[]) {
        // TODO SPO2
    }
}