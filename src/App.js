import { useState, useRef } from "react";
import "./App.css";

function App() {
  const inputRef = useRef(null);
  const resultRef = useRef(null);
  const [result, setResult] = useState(0);
  const [pendingOp, setPendingOp] = useState(null);
  const [firstValue, setFirstValue] = useState(null);
  const [activeOp, setActiveOp] = useState(null);
  const [justCalculated, setJustCalculated] = useState(false);

  function calculate(a, op, b) {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return a / b;
      default: return b;
    }
  }

  function handleOperation(e, op) {
    e.preventDefault();
    const currentInput = Number(inputRef.current.value);

    if (firstValue === null) {
      // First time pressing an operator: store the first number
      setFirstValue(currentInput);
      setResult(currentInput);
    } else if (pendingOp && !justCalculated) {
      // Chain operations: calculate previous result first
      const newResult = calculate(firstValue, pendingOp, currentInput);
      setFirstValue(newResult);
      setResult(newResult);
    }

    setPendingOp(op);
    setActiveOp(op);
    setJustCalculated(false);
    inputRef.current.value = "";
    setTimeout(() => setActiveOp(null), 300);
  }

  function handleEquals(e) {
    e.preventDefault();
    const currentInput = Number(inputRef.current.value);

    if (firstValue !== null && pendingOp) {
      const newResult = calculate(firstValue, pendingOp, currentInput);
      setResult(newResult);
      setFirstValue(newResult);
      setPendingOp(null);
      setJustCalculated(true);
      inputRef.current.value = "";
      setActiveOp("=");
      setTimeout(() => setActiveOp(null), 300);
    }
  }

  function resetInput(e) {
    e.preventDefault();
    inputRef.current.value = "";
  }

  function resetResult(e) {
    e.preventDefault();
    setResult(0);
    setFirstValue(null);
    setPendingOp(null);
    setJustCalculated(false);
    inputRef.current.value = "";
  }

  function handleNumPad(e, value) {
    e.preventDefault();
    const input = inputRef.current;

    // If we just pressed = and got a result, start fresh with new number
    if (justCalculated) {
      input.value = "";
      setJustCalculated(false);
    }

    if (value === "." && input.value.includes(".")) return;
    if (value === "⌫") {
      input.value = input.value.slice(0, -1);
      return;
    }
    if (value === "±") {
      if (input.value.startsWith("-")) {
        input.value = input.value.slice(1);
      } else if (input.value) {
        input.value = "-" + input.value;
      }
      return;
    }
    input.value = input.value + value;
  }

  const formatResult = (num) => {
    if (num === Infinity || num === -Infinity) return "Error";
    if (isNaN(num)) return "Error";
    if (Number.isInteger(num)) return num.toLocaleString();
    return parseFloat(num.toFixed(8)).toLocaleString(undefined, { maximumFractionDigits: 8 });
  };

  const getOpSymbol = (op) => {
    switch (op) {
      case "+": return "+";
      case "-": return "−";
      case "*": return "×";
      case "/": return "÷";
      default: return "";
    }
  };

  return (
    <div className="App">
      <div className="calculator">
        <div className="calculator-header">
          <div className="header-dots">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <span className="header-title">Calculator</span>
        </div>

        <form>
          <div className="display-area">
            <p className="result-label">
              {pendingOp && firstValue !== null
                ? `${formatResult(firstValue)} ${getOpSymbol(pendingOp)}`
                : "Result"}
            </p>
            <p className={`result-value ${activeOp ? "pulse" : ""}`} ref={resultRef}>
              {formatResult(result)}
            </p>
            <input
              pattern="[0-9]"
              ref={inputRef}
              type="number"
              placeholder="0"
            />
          </div>

          <div className="operations-row">
            <button className={`op-btn ${pendingOp === "+" ? "op-active" : ""}`} onClick={(e) => handleOperation(e, "+")} title="Add">+</button>
            <button className={`op-btn ${pendingOp === "-" ? "op-active" : ""}`} onClick={(e) => handleOperation(e, "-")} title="Subtract">−</button>
            <button className={`op-btn ${pendingOp === "*" ? "op-active" : ""}`} onClick={(e) => handleOperation(e, "*")} title="Multiply">×</button>
            <button className={`op-btn ${pendingOp === "/" ? "op-active" : ""}`} onClick={(e) => handleOperation(e, "/")} title="Divide">÷</button>
          </div>

          <div className="numpad">
            {["7", "8", "9", "4", "5", "6", "1", "2", "3", "±", "0", "."].map(
              (val) => (
                <button
                  key={val}
                  className="num-btn"
                  onClick={(e) => handleNumPad(e, val)}
                >
                  {val}
                </button>
              )
            )}
          </div>

          <div className="action-row">
            <button className="action-btn backspace-btn" onClick={(e) => handleNumPad(e, "⌫")}>
              ⌫
            </button>
            <button className="action-btn equals-btn" onClick={handleEquals}>
              =
            </button>
            <button className="action-btn clear-input-btn" onClick={resetInput}>
              CE
            </button>
            <button className="action-btn reset-btn" onClick={resetResult}>
              AC
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
