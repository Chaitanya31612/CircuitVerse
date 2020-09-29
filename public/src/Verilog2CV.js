import AndGate from './modules/AndGate';
import NandGate from './modules/NandGate';
import Multiplexer from './modules/Multiplexer';
import XorGate from './modules/XorGate';
import XnorGate from './modules/XnorGate';
import SevenSegDisplay from './modules/SevenSegDisplay';
import SixteenSegDisplay from './modules/SixteenSegDisplay';
import HexDisplay from './modules/HexDisplay';
import OrGate from './modules/OrGate';
import Stepper from './modules/Stepper';
import NotGate from './modules/NotGate';
import Text from './modules/Text';
import TriState from './modules/TriState';
import Buffer from './modules/Buffer';
import ControlledInverter from './modules/ControlledInverter';
import Adder from './modules/Adder';
import TwoComplement from './modules/TwoComplement';
import Splitter from './modules/Splitter';
import Ground from './modules/Ground';
import Power from './modules/Power';
import Input from './modules/Input';
import Output from './modules/Output';
import BitSelector from './modules/BitSelector';
import ConstantVal from './modules/ConstantVal';
import NorGate from './modules/NorGate';
import DigitalLed from './modules/DigitalLed';
import VariableLed from './modules/VariableLed';
import Button from './modules/Button';
import RGBLed from './modules/RGBLed';
import SquareRGBLed from './modules/SquareRGBLed';
import Demultiplexer from './modules/Demultiplexer';
import Decoder from './modules/Decoder';
import Flag from './modules/Flag';
import MSB from './modules/MSB';
import LSB from './modules/LSB';
import PriorityEncoder from './modules/PriorityEncoder';
import Tunnel from './modules/Tunnel';
import ALU from './modules/ALU';
import Rectangle from './modules/Rectangle';
import Arrow from './modules/Arrow';
import Counter from './modules/Counter';
import Random from './modules/Random';
import RGBLedMatrix from './modules/RGBLedMatrix';
import simulationArea from './simulationArea';
import TflipFlop from './sequential/TflipFlop';
import DflipFlop from './sequential/DflipFlop';
import Dlatch from './sequential/Dlatch';
import SRflipFlop from './sequential/SRflipFlop';
import JKflipFlop from './sequential/JKflipFlop';
import TTY from './sequential/TTY';
import Keyboard from './sequential/Keyboard';
import Clock from './sequential/Clock';
import RAM from './sequential/RAM';
import EEPROM from './sequential/EEPROM';
import Rom from './sequential/Rom';
import TB_Input from './testbench/testbenchInput';
import TB_Output from './testbench/testbenchOutput';
import ForceGate from './testbench/ForceGate';
import { newCircuit, switchCircuit } from './circuit'
import SubCircuit from './subcircuit'

function getBitWidth(bitsJSON) {
    if (Number.isInteger(bitsJSON)) {
        return bitsJSON;
    }
    else {
        var ans = 1;
        for (var i in bitsJSON) {
            ans = Math.max(ans, bitsJSON[i]);
        }
        return ans;
    }
}

class verilogUnaryGate{
    constructor(deviceJSON){
        this.bitWidth = 1;
        if (deviceJSON["bits"]) {
            this.bitWidth = getBitWidth(deviceJSON["bits"]);
        }
    };

    getPort(portName){
        if(portName == "in"){
            return this.input;
        }
        if(portName == "out")
        {
            return this.output;
        }
    }
}

class verilogInput extends verilogUnaryGate{
    constructor(deviceJSON){
        super(deviceJSON);
        if (deviceJSON["net"] == "clk" || deviceJSON["net"] == "clock") {
            this.element = new Clock(0, 0);
            this.output = this.element.output1;
        } else {
            this.element = new Input(0, 0, undefined, undefined, this.bitWidth);
            this.output = this.element.output1;
        }
        this.element.label = deviceJSON["net"];
    }
}

class verilogOutput extends verilogUnaryGate{
    constructor(deviceJSON){
        super(deviceJSON);
        this.element = new Output(0, 0, undefined, undefined, this.bitWidth);
        this.input = this.element.inp1;
        this.element.label = deviceJSON["net"];
    }
}

class verilogNotGate extends verilogUnaryGate{
    constructor(deviceJSON){
        super(deviceJSON);
        this.element = new NotGate(0, 0, undefined, undefined, this.bitWidth);
        this.input = this.element.inp1;
        this.output = this.element.output1;
    }
}

class verilogConstantVal extends verilogUnaryGate{
    constructor(deviceJSON){
        super(deviceJSON);
        this.bitWidth = deviceJSON["constant"].length;
        this.state = deviceJSON["constant"];
        this.element = new ConstantVal(0, 0, undefined, undefined, this.bitWidth, this.state);
        this.input = this.element.inp1;
        this.output = this.element.output1;
    }
}



class verilogReduceAndGate extends verilogUnaryGate{
    constructor(deviceJSON){
        super(deviceJSON);
        
        bitWidthSplit = [];
        for (var i = 0; i < this.bitWidth; i++){
            bitWidthSplit.push(1);
        }
        
        this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, bitWidthSplit);
        this.andGate = new AndGate(0, 0, undefined, undefined, this.bitWidth, 1);

        for(var i = 0; i < this.bitWidth; i++){
            this.splitter.outputs[i].connect(this.andGate.inp[i]);
        }
        
        this.input = this.splitter.inp1;
        this.output = this.andGate.output1;
    }
}

class verilogReduceNandGate extends verilogUnaryGate{
    constructor(deviceJSON){
        super(deviceJSON);
        
        bitWidthSplit = [];
        for (var i = 0; i < this.bitWidth; i++){
            bitWidthSplit.push(1);
        }
        
        this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, bitWidthSplit);
        this.nandGate = new NandGate(0, 0, undefined, undefined, this.bitWidth, 1);

        for(var i = 0; i < this.bitWidth; i++){
            this.splitter.outputs[i].connect(this.nandGate.inp[i]);
        }
        
        this.input = this.splitter.inp1;
        this.output = this.nandGate.output1;
    }
}

class verilogReduceOrGate extends verilogUnaryGate{
    constructor(deviceJSON){
        super(deviceJSON);
        
        bitWidthSplit = [];
        for (var i = 0; i < this.bitWidth; i++){
            bitWidthSplit.push(1);
        }
        
        this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, bitWidthSplit);
        this.orGate = new OrGate(0, 0, undefined, undefined, this.bitWidth, 1);

        for(var i = 0; i < this.bitWidth; i++){
            this.splitter.outputs[i].connect(this.orGate.inp[i]);
        }
        
        this.input = this.splitter.inp1;
        this.output = this.orGate.output1;
    }
}

class verilogReduceNorGate extends verilogUnaryGate{
    constructor(deviceJSON){
        super(deviceJSON);
        
        bitWidthSplit = [];
        for (var i = 0; i < this.bitWidth; i++){
            bitWidthSplit.push(1);
        }
        
        this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, bitWidthSplit);
        this.norGate = new NorGate(0, 0, undefined, undefined, this.bitWidth, 1);

        for(var i = 0; i < this.bitWidth; i++){
            this.splitter.outputs[i].connect(this.norGate.inp[i]);
        }
        
        this.input = this.splitter.inp1;
        this.output = this.norGate.output1;
    }
}

class verilogReduceXorGate extends verilogUnaryGate{
    constructor(deviceJSON){
        super(deviceJSON);
        
        bitWidthSplit = [];
        for (var i = 0; i < this.bitWidth; i++){
            bitWidthSplit.push(1);
        }
        
        this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, bitWidthSplit);
        this.xorGate = new XorGate(0, 0, undefined, undefined, this.bitWidth, 1);

        for(var i = 0; i < this.bitWidth; i++){
            this.splitter.outputs[i].connect(this.xorGate.inp[i]);
        }
        
        this.input = this.splitter.inp1;
        this.output = this.xorGate.output1;
    }
}

class verilogReduceXnorGate extends verilogUnaryGate{
    constructor(deviceJSON){
        super(deviceJSON);
        
        bitWidthSplit = [];
        for (var i = 0; i < this.bitWidth; i++){
            bitWidthSplit.push(1);
        }
        
        this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, bitWidthSplit);
        this.xnorGate = new XnorGate(0, 0, undefined, undefined, this.bitWidth, 1);

        for(var i = 0; i < this.bitWidth; i++){
            this.splitter.outputs[i].connect(this.xnorGate.inp[i]);
        }
        
        this.input = this.splitter.inp1;
        this.output = this.xnorGate.output1;
    }
}

class verilogBusSlice extends verilogUnaryGate {
    constructor(deviceJSON) {
        super(deviceJSON);
        this.bitWidth = deviceJSON["slice"]["total"];
        
        this.start = deviceJSON["slice"]["first"];
        this.count = deviceJSON["slice"]["count"];
        if(this.start == 0)
        {
            if(this.count == this.bitWidth)
            {
                this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, [this.bitWidth]);
            }
            else
            {
                this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, [this.count]);
            }
            
            this.input = this.splitter.inp1;
            this.output = this.splitter.outputs[0];
        }
        else
        {
            this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, [this.start, this.count]);
            this.input = this.splitter.inp1;
            this.output = this.splitter.outputs[1];
        }
    }
}

class verilogBinaryGate{
    constructor(deviceJSON){
        this.bitWidth = 1;
        if (deviceJSON["bits"]) {
            this.bitWidth = getBitWidth(deviceJSON["bits"]);
        }
    };

    getPort(portName){
        if(portName == "in1"){
            return this.input[0];deviceJSON["arst_value"]
        }
        else if(portName == "in2"){
            return this.input[1];
        }
        else if (portName == "out"){
            return this.output;
        }
    }
}

class verilogAndGate extends verilogBinaryGate{
    constructor(deviceJSON){
        super(deviceJSON);
        this.element = new AndGate(0, 0, undefined, undefined, undefined, this.bitWidth);
        this.input = [this.element.inp[0], this.element.inp[1]];
        this.output = this.element.output1;
    }
}

class verilogNandGate extends verilogBinaryGate {
    constructor(deviceJSON){
        super(deviceJSON);
        this.element = new NandGate(0, 0, undefined, undefined, undefined, this.bitWidth);
        this.input = [this.element.inp[0], this.element.inp[1]];
        this.output = this.element.output1;
    }
}

class verilogOrGate extends verilogBinaryGate{
    constructor(deviceJSON){
        super(deviceJSON);
        this.element = new OrGate(0, 0, undefined, undefined, undefined, this.bitWidth);
        this.input = [this.element.inp[0], this.element.inp[1]];
        this.output = this.element.output1;
    }
}

class verilogNorGate extends verilogBinaryGate {
    constructor(deviceJSON){
        super(deviceJSON);
        this.element = new NorGate(0, 0, undefined, undefined, undefined, this.bitWidth);
        this.input = [this.element.inp[0], this.element.inp[1]];
        this.output = this.element.output1;
    }
}

class verilogXorGate extends verilogBinaryGate {
    constructor(deviceJSON){
        super(deviceJSON);
        this.element = new XorGate(0, 0, undefined, undefined, undefined, this.bitWidth);
        this.input = [this.element.inp[0], this.element.inp[1]];
        this.output = this.element.output1;
    }
}

class verilogXnorGate extends verilogBinaryGate {
    constructor(deviceJSON){
        super(deviceJSON);
        this.element = new XnorGate(0, 0, undefined, undefined, undefined, this.bitWidth);
        this.input = [this.element.inp[0], this.element.inp[1]];
        this.output = this.element.output1;
    }
}

class verilogMathGate extends verilogBinaryGate {
    constructor(deviceJSON){
        super(deviceJSON);

        this.bitWidth = Math.max(deviceJSON["bits"]["in1"], deviceJSON["bits"]["in2"]);

        if (!Number.isInteger(deviceJSON["bits"])) {
            this.in1BitWidth = deviceJSON["bits"]["in1"];
            this.in2BitWidth = deviceJSON["bits"]["in2"];
        }

        this.input = [];

        var extraBits = this.bitWidth - this.in1BitWidth;

        if(extraBits != 0)
        {
            this.in1Splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, [this.in1BitWidth, extraBits]);
            
            var zeroState = '';
            for(var i = 0; i < extraBits; i++)
            {
                zeroState += '0';
            }
            this.in1ZeroConstant = new ConstantVal(0, 0, undefined, undefined, extraBits, zeroState);
            this.in1ZeroConstant.output1.connect(this.in1Splitter.outputs[1]);
        }
        else
        {
            this.in1Splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, [this.bitWidth]);
        }

        var extraBits = this.bitWidth - this.in2BitWidth;
        if(extraBits != 0)
        {
            this.in2Splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, [this.in2BitWidth, extraBits]);
            var zeroState = '';
            for(var i = 0; i < extraBits; i++)
            {
                zeroState += '0';
            }

            this.in2ZeroConstant = new ConstantVal(0, 0, undefined, undefined, extraBits, zeroState);
            this.in2ZeroConstant.output1.connect(this.in2Splitter.outputs[1]);
        }
        else
        {
            this.in2Splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, [this.bitWidth]);
        }

        this.input = [this.in1Splitter.outputs[0], this.in2Splitter.outputs[0]];
    }
}

class verilogEqGate extends verilogMathGate {
    constructor(deviceJSON){
        super(deviceJSON);

        var bitWidthSplit = [];

        for(var i = 0; i < this.bitWidth; i++){
            bitWidthSplit.push(1);
        }

        this.xnorGate = new XnorGate(0, 0, undefined, undefined, undefined, this.bitWidth);
        this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, bitWidthSplit);
        this.andGate = new AndGate(0, 0, undefined, undefined, this.bitWidth);
        this.in1Splitter.inp1.connect(this.xnorGate.inp[0]);
        this.in2Splitter.inp1.connect(this.xnorGate.inp[1]);

        this.xnorGate.output1.connect(this.splitter.inp1);
        for(var i = 0; i < this.bitWidth; i++)
        {
            this.splitter.outputs[i].connect(this.andGate.inp[i]);
        }

        this.output = this.andGate.output1;
    }
}

class verilogNeGate extends verilogMathGate {
    constructor(deviceJSON){
        super(deviceJSON);

        var bitWidthSplit = [];

        for(var i = 0; i < this.bitWidth; i++){
            bitWidthSplit.push(1);
        }

        this.xnorGate = new XnorGate(0, 0, undefined, undefined, undefined, this.bitWidth);
        this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, bitWidthSplit);
        this.nandGate = new NandGate(0, 0, undefined, undefined, this.bitWidth);

        this.in1Splitter.inp1.connect(this.xnorGate.inp[0]);
        this.in2Splitter.inp1.connect(this.xnorGate.inp[1]);

        this.xnorGate.output1.connect(this.splitter.inp1);
        for(var i = 0; i < this.bitWidth; i++)
        {
            this.splitter.outputs[i].connect(this.nandGate.inp[i]);
        }

        this.output = this.nandGate.output1;
    }
}

class verilogLtGate extends verilogMathGate {
    constructor(deviceJSON) {
        super(deviceJSON);
        this.constant7 = new ConstantVal(0, 0, undefined, undefined, 3, "111");
        this.alu = new ALU(0, 0, undefined, undefined, this.bitWidth);
        this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, [1]);

        this.in1Splitter.inp1.connect(this.alu.inp1);
        this.in2Splitter.inp1.connect(this.alu.inp2);

        this.constant7.output1.connect(this.alu.controlSignalInput);
        this.alu.output.connect(this.splitter.inp1);

        this.output = this.splitter.outputs[0];
    }
}

class verilogGtGate extends verilogMathGate {
    constructor(deviceJSON) {
        super(deviceJSON);
        this.constant7 = new ConstantVal(0, 0, undefined, undefined, 3, "111");
        this.alu = new ALU(0, 0, undefined, undefined, this.bitWidth);
        this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, [1]);

        this.in1Splitter.inp1.connect(this.alu.inp1);
        this.in2Splitter.inp1.connect(this.alu.inp2);

        this.constant7.output1.connect(this.alu.controlSignalInput);
        this.alu.output.connect(this.splitter.inp1);

        this.output = this.splitter.outputs[0];
    }
}

class verilogGeGate extends verilogMathGate {
    constructor(deviceJSON) {
        super(deviceJSON);
        this.constant7 = new ConstantVal(0, 0, undefined, undefined, 3, "111");
        this.alu = new ALU(0, 0, undefined, undefined, this.bitWidth);
        this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, [1]);
        this.notGate = new NotGate(0, 0);

        this.in1Splitter.inp1.connect(this.alu.inp1);
        this.in2Splitter.inp1.connect(this.alu.inp2);

        this.constant7.output1.connect(this.alu.controlSignalInput);
        this.alu.output.connect(this.splitter.inp1);
        this.splitter.outputs[0].connect(this.notGate.inp1);

        this.output = this.notGate.output1;
    }
}

class verilogLeGate extends verilogMathGate {
    constructor(deviceJSON) {
        super(deviceJSON);
        this.constant7 = new ConstantVal(0, 0, undefined, undefined, 3, "111");
        this.alu = new ALU(0, 0, undefined, undefined, this.bitWidth);
        this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, [1]);
        this.notGate = new NotGate(0, 0);

        this.in1Splitter.inp1.connect(this.alu.inp1);
        this.in2Splitter.inp1.connect(this.alu.inp2);

        this.constant7.output1.connect(this.alu.controlSignalInput);
        this.alu.output.connect(this.splitter.inp1);
        this.splitter.outputs[0].connect(this.notGate.inp1);

        this.output = this.notGate.output1;
    }
}

class verilogAdditionGate extends verilogMathGate {
    constructor(deviceJSON) {
        super(deviceJSON);

        this.outBitWidth = deviceJSON["bits"]["out"];

        this.adder = new Adder(0, 0, undefined, undefined, this.bitWidth);

        this.in1Splitter.inp1.connect(this.adder.inpA);
        this.in2Splitter.inp1.connect(this.adder.inpB);

        if(this.outBitWidth == this.bitWidth)
        {
            this.output = this.adder.sum;
        }
        else if(this.outBitWidth == this.bitWidth + 1)
        {
            this.outputSplitter = new Splitter(0, 0, undefined, undefined, this.outBitWidth, [this.bitWidth, 1]);
            this.adder.sum.connect(this.outputSplitter.outputs[0]);
            this.adder.carryOut.connect(this.outputSplitter.outputs[1]);
            this.output = this.outputSplitter.inp1;
        }
    }
}

class verilogDff{
    constructor(deviceJSON) {
        this.bitWidth = 1;
        if (deviceJSON["bits"]) {
            this.bitWidth = getBitWidth(deviceJSON["bits"]);
        }

        this.dff = new DflipFlop(0, 0, undefined, undefined, this.bitWidth);
        this.clockInput = this.dff.clockInp;
        this.arstInput = this.dff.reset;
        this.enableInput = this.dff.en;

        this.clockPolarity = true;
        this.arstPolarity = true;
        this.enablePolarity = true;

        if (deviceJSON["polarity"]["clock"] != undefined) {
            this.clockPolarity = deviceJSON["polarity"]["clock"];
        }
        if (this.clockPolarity == false) {
            this.notGateClock = new NotGate(0, 0);
            this.notGateClock.output1.connect(this.dff.clockInp);
            this.clockInput = this.notGateClock.inp1;
        }

        if (deviceJSON["polarity"]["enable"] != undefined) {
            this.enablePolarity = deviceJSON["polarity"]["enable"];
        }
        if (this.enablePolarity == false) {
            this.notGateEnable = new NotGate(0, 0);
            this.notGateEnable.output1.connect(this.dff.en);
            this.enableInput = this.notGateEnable.inp1;
        }

        
        if (deviceJSON["polarity"]["arst"] != undefined) {
            this.arstPolarity = deviceJSON["polarity"]["arst"];
        }
        if (this.arstPolarity == false) {
            this.notGateArst = new NotGate(0, 0);
            this.notGateArst.output1.connect(this.dff.reset);
            this.arstInput = this.notGateArst.inp1;
        }
        if (deviceJSON["arst_value"] != undefined) {
            this.arst_value_constant = new ConstantVal(0, 0, undefined, undefined, this.bitWidth, deviceJSON["arst_value"]);
            this.arst_value_constant.output1.connect(this.dff.preset);
        }

        this.dInput = this.dff.dInp;
        this.qOutput = this.dff.qOutput;
    }

    getPort(portName){
        if (portName == "clk") {
            return this.clockInput;
        } 
        else if (portName == "in") {
            return this.dInput;
        }
        else if (portName == "arst") {
            return this.arstInput;
        }
        else if(portName == "en")
        {
            return this.enableInput;
        }
        else if (portName == "out") {
            return this.qOutput;
        }
    }
}

class verilogMultiplexer {
    constructor(deviceJSON) {
        this.bitWidth = 1;
        this.selectBitWidth = undefined;
        if (deviceJSON["bits"]["in"] != undefined) {
            this.bitWidth = deviceJSON["bits"]["in"];
        }

        if (deviceJSON["bits"]["sel"] != undefined) {
            this.selectBitWidth = deviceJSON["bits"]["sel"];
        }

        this.multiplexer = new Multiplexer(0, 0, undefined, undefined, this.bitWidth, this.selectBitWidth);

        this.input = this.multiplexer.inp;
        this.selectInput = this.multiplexer.controlSignalInput;
        this.output = this.multiplexer.output1;
    }

    getPort(portName) {
        if(portName == "sel") {
            return this.selectInput;
        }
        else if(portName == "out") {
            return this.output;
        }
        else {
            var len = portName.length;
            var index = parseInt(portName.substring(2, len));

            return this.input[index];
        }
    }
}

class verilogMultiplexer1Hot {
    constructor(deviceJSON) {
        this.bitWidth = 1;
        this.selectBitWidth = undefined;
        if (deviceJSON["bits"]["in"] != undefined) {
            this.bitWidth = deviceJSON["bits"]["in"];
        }

        if (deviceJSON["bits"]["sel"] != undefined) {
            this.selectBitWidth = deviceJSON["bits"]["sel"];
        }

        this.multiplexer = new Multiplexer(0, 0, undefined, undefined, this.bitWidth, this.selectBitWidth);
        this.lsb = new LSB(0, 0, undefined, undefined, this.selectBitWidth);
        this.adder = new Adder(0, 0, undefined, undefined, this.selectBitWidth);

        this.zeroState = '';
        for(var i = 0; i < this.selectBitWidth - 1; i++)
        {
            this.zeroState += '0';
        }
        this.zeroPadEnable = new ConstantVal(0, 0, undefined, undefined, this.selectBitWidth - 1,this.zeroState);

        this.enbaleSplitter = new Splitter(0, 0, undefined, undefined, this.selectBitWidth, [1, this.selectBitWidth - 1]);

        this.lsb.enable.connect(this.enbaleSplitter.outputs[0]);
        this.zeroPadEnable.output1.connect(this.enbaleSplitter.outputs[1]);

        this.adder.inpA.connect(this.lsb.output1);
        this.adder.inpB.connect(this.enbaleSplitter.inp1);

        this.adder.sum.connect(this.multiplexer.controlSignalInput);
        this.input = this.multiplexer.inp;
        this.selectInput = this.lsb.inp1;
        this.output = this.multiplexer.output1;
    }

    getPort(portName) {
        if(portName == "sel") {
            return this.selectInput;
        }
        else if(portName == "out") {
            return this.output;
        }
        else {
            var len = portName.length;
            var index = parseInt(portName.substring(2, len));

            return this.input[index];
        }
    }
}

class verilogBusGroup {
    constructor(deviceJSON) {
        this.bitWidth = 0;
        this.bitWidthSplit = deviceJSON["groups"];

        for(var i = 0; i < this.bitWidthSplit.length; i++){
            this.bitWidth += this.bitWidthSplit[i];
        }

        this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, this.bitWidthSplit);

        this.input = this.splitter.outputs;
        this.output = this.splitter.inp1;
    }

    getPort(portName) {
        if (portName == "out") {
            return this.output;
        } else {
            var len = portName.length;
            var index = parseInt(portName.substring(2, len));

            return this.input[index];
        }
    }
}

class verilogBusUngroup {
    constructor(deviceJSON) {
        this.bitWidth = 0;
        this.bitWidthSplit = deviceJSON["groups"];

        for(var i = 0; i < this.bitWidthSplit.length; i++){
            this.bitWidth += this.bitWidthSplit[i];
        }

        this.splitter = new Splitter(0, 0, undefined, undefined, this.bitWidth, this.bitWidthSplit);

        this.input = this.splitter.inp1;
        this.output = this.splitter.outputs;
    }

    getPort(portName) {
        if (portName == "in") {
            return this.input;
        } else {
            var len = portName.length;
            var index = parseInt(portName.substring(3, len));

            return this.output[index];
        }
    }
}

let typeToNode = {};

typeToNode["Not"] = verilogNotGate;
typeToNode["And"] = verilogAndGate;
typeToNode["Nand"] = verilogNandGate;
typeToNode["Or"] = verilogOrGate;
typeToNode["Nor"] = verilogNorGate;
typeToNode["Xor"] = verilogXorGate;
typeToNode["Xnor"] = verilogXnorGate;
typeToNode["Constant"] = verilogConstantVal;
typeToNode["Input"] = verilogInput;
typeToNode["Output"] = verilogOutput;
typeToNode["AndReduce"] = verilogReduceAndGate;
typeToNode["NandReduce"] = verilogReduceNandGate;
typeToNode["OrReduce"] = verilogReduceOrGate;
typeToNode["NorReduce"] = verilogReduceNorGate;
typeToNode["XorReduce"] = verilogReduceXorGate;
typeToNode["XnorReduce"] = verilogReduceXnorGate;

typeToNode["Eq"] = verilogEqGate;
typeToNode["Ne"] = verilogNeGate;

typeToNode["Lt"] = verilogLtGate;
typeToNode["Le"] = verilogLeGate;
typeToNode["Ge"] = verilogGeGate;
typeToNode["Gt"] = verilogGtGate;

typeToNode["Dff"] = verilogDff;
typeToNode["Mux"] = verilogMultiplexer;
typeToNode["Mux1Hot"] = verilogMultiplexer1Hot;
typeToNode["BusSlice"] = verilogBusSlice;
typeToNode["BusGroup"] = verilogBusGroup;
typeToNode["BusUngroup"] = verilogBusUngroup;

typeToNode["Addition"] = verilogAdditionGate;

export default function YosysJSON2CV(JSON){

    var mainID = (globalScope.id);
    let subScope = newCircuit("verilog");
    var subScopeID = subScope.id;
    var circuitDevices = {};
    for (var device in JSON.devices) {
        var deviceType = JSON.devices[device].type;
        circuitDevices[device] = new typeToNode[deviceType](JSON.devices[device]);
    }



    for (var connection in JSON.connectors) {
        if (connection == "clean") break;

        var fromId = JSON.connectors[connection]["from"]["id"];
        var fromPort = JSON.connectors[connection]["from"]["port"];
        var toId = JSON.connectors[connection]["to"]["id"];
        var toPort = JSON.connectors[connection]["to"]["port"];

        var fromObj = circuitDevices[fromId];
        var toObj = circuitDevices[toId];

        var fromPortNode = fromObj.getPort(fromPort);
        var toPortNode = toObj.getPort(toPort);

        fromPortNode.connect(toPortNode);
    }
    
    switchCircuit(mainID);
    var veriSubCircuit = new SubCircuit(500, 500, undefined, subScopeID);
    return veriSubCircuit;
}
