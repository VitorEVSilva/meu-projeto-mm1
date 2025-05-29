import React, { useState, useEffect } from 'react';
import './QueueCalculator.css'; // Seu arquivo de estilização

const QueueCalculator = () => {
    const [lambda, setLambda] = useState(1.0);
    const [mu, setMu] = useState(3.0);

    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [derivedN, setDerivedN] = useState(Math.max(0, Math.floor(parseFloat(lambda))));
    const [derivedK, setDerivedK] = useState(Math.max(0, Math.floor(parseFloat(lambda))));

    useEffect(() => {
        const calculateMetrics = () => {
            const arrivalRate = parseFloat(lambda);
            const serviceRate = parseFloat(mu);

            if (isNaN(arrivalRate) || isNaN(serviceRate) || arrivalRate <= 0 || serviceRate <= 0) {
                setError('As taxas de chegada e atendimento devem ser números positivos.');
                setResults(null);
                return;
            }

            if (arrivalRate >= serviceRate) {
                setError('A taxa de chegada (λ) deve ser menor que a taxa de atendimento (μ) para um sistema estável.');
                setResults(null);
                return;
            }

            setError('');

            const nForPn = Math.max(0, Math.floor(arrivalRate));
            const kForPLessEqual = Math.max(0, Math.floor(arrivalRate));
            setDerivedN(nForPn);
            setDerivedK(kForPLessEqual);

            const rho = arrivalRate / serviceRate;
            const p0 = 1 - rho;
            const pn_val = p0 * Math.pow(rho, nForPn);
            const p_less_equal_target = 1 - Math.pow(rho, kForPLessEqual + 1);
            const l_sistema = arrivalRate / (serviceRate - arrivalRate);
            const l_fila = l_sistema - rho; // Lq = L - rho (ou (arrivalRate ** 2) / (serviceRate * (serviceRate - arrivalRate)))
            const w_sistema = l_sistema / arrivalRate; // W = L / lambda (ou 1 / (serviceRate - arrivalRate))
            const w_fila = l_fila / arrivalRate; // Wq = Lq / lambda (ou arrivalRate / (serviceRate * (serviceRate - arrivalRate)))

            setResults({
                rho, p0, pn_val, p_less_equal_target,
                l_sistema, l_fila, w_sistema, w_fila,
            });
        };

        calculateMetrics();
    }, [lambda, mu]);

    return (
        <div className="calculator-container">
            <h2>Calculadora de Filas M/M/1 📊</h2>

            <div className="input-group">
                <label htmlFor="lambda">Taxa de Chegada (λ):</label>
                <input
                    type="number" id="lambda" value={lambda}
                    onChange={(e) => setLambda(e.target.value)}
                    step="0.1" min="0.01"
                />
            </div>

            <div className="input-group">
                <label htmlFor="mu">Taxa de Atendimento (μ):</label>
                <input
                    type="number" id="mu" value={mu}
                    onChange={(e) => setMu(e.target.value)}
                    step="0.1" min="0.01"
                />
            </div>

            {error && <p className="error-message">{error}</p>}

            {results && !error && (
                <div className="results-grid">
                    <h3>Resultados:</h3>
                    <p style={{fontSize: '0.9em', color: '#666', textAlign: 'center', marginBottom: '1rem'}}>
                        (Para P<sub>n</sub> e P(N ≤ k), os valores de n e k são ⌊λ⌋ = {derivedN})
                     </p>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Taxa de Utilização (ρ):</strong>
                            <span>{(results.rho * 100).toFixed(1)}%</span>
                        </div>
                        <div className="formula-text">ρ = λ / μ</div>
                    </div>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Prob. de Sistema Vazio (P<sub>0</sub>):</strong>
                            <span>{(results.p0 * 100).toFixed(1)}%</span>
                        </div>
                        <div className="formula-text">P<sub>0</sub> = 1 - ρ</div>
                    </div>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Prob. de {derivedN} cliente(s) no sistema (P<sub>{derivedN}</sub>):</strong>
                            <span>{(results.pn_val * 100).toFixed(1)}%</span>
                        </div>
                        <div className="formula-text">P<sub>n</sub> = P<sub>0</sub> ⋅ ρ<sup>n</sup></div>
                    </div>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Prob. de até {derivedK} cliente(s) no sistema (P(N ≤ {derivedK})):</strong>
                            <span>{(results.p_less_equal_target * 100).toFixed(1)}%</span>
                        </div>
                        <div className="formula-text">P(N ≤ k) = 1 - ρ<sup>k+1</sup></div>
                    </div>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Nº Médio de Clientes no Sistema (L):</strong>
                            <span>{results.l_sistema.toFixed(3)}</span>
                        </div>
                        <div className="formula-text">L = λ / (μ - λ)</div>
                    </div>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Nº Médio de Clientes na Fila (L<sub>q</sub>):</strong>
                            <span>{results.l_fila.toFixed(3)}</span>
                        </div>
                        <div className="formula-text">L<sub>q</sub> = L - ρ</div>
                    </div>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Tempo Médio no Sistema (W):</strong>
                            <span>{results.w_sistema.toFixed(3)}</span>
                        </div>
                        <div className="formula-text">W = L / λ</div>
                    </div>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Tempo Médio na Fila (W<sub>q</sub>):</strong>
                            <span>{results.w_fila.toFixed(3)}</span>
                        </div>
                        <div className="formula-text">W<sub>q</sub> = L<sub>q</sub> / λ</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QueueCalculator;