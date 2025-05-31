import React, { useState, useEffect } from 'react';
import './QueueCalculator.css'; // Seu arquivo de estilização

const QueueCalculator = () => {
    const [lambda, setLambda] = useState(1.0);
    const [mu, setMu] = useState(3.0);
    const [nUnits, setNUnits] = useState('1');
    const [targetN, setTargetN] = useState('1');

    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    // Variáveis para guardar os valores parseados de n e k para usar na exibição dos cálculos
    // Elas serão atualizadas quando os resultados forem calculados
    let nValForDisplay = parseInt(nUnits);
    let kValForDisplay = parseInt(targetN);

    useEffect(() => {
        // A função calculateMetrics permanece a mesma da última versão
        // Ela já calcula: rho, p0, pn_val, p_less_equal_k, p_greater_than_k, l_sistema, l_fila, w_sistema, w_fila
        // E os armazena em 'results'
        const calculateMetrics = () => {
            const arrivalRate = parseFloat(lambda);
            const serviceRate = parseFloat(mu);
            const n_for_pn = parseInt(nUnits);
            const k_for_probs = parseInt(targetN);

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
            if (isNaN(n_for_pn) || n_for_pn < 0) {
                setError('O valor de "n" para Pn deve ser um inteiro não negativo.');
                setResults(null);
                return;
            }
            if (isNaN(k_for_probs) || k_for_probs < 0) {
                setError('O valor de "k" para as probabilidades P(N ≤ k) e P(N > k) deve ser um inteiro não negativo.');
                setResults(null);
                return;
            }
            setError('');

            const rho = arrivalRate / serviceRate;
            const p0 = 1 - rho;
            const pn_val = p0 * Math.pow(rho, n_for_pn);
            const p_less_equal_k = 1 - Math.pow(rho, k_for_probs + 1);
            const p_greater_than_k = Math.pow(rho, k_for_probs + 1);
            const l_sistema = arrivalRate / (serviceRate - arrivalRate);
            const l_fila = l_sistema - rho;
            const w_sistema = l_sistema / arrivalRate;
            const w_fila = l_fila / arrivalRate;

            setResults({
                rho, p0, pn_val, p_less_equal_k, p_greater_than_k,
                l_sistema, l_fila, w_sistema, w_fila,
            });
        };
        calculateMetrics();
    }, [lambda, mu, nUnits, targetN]);


    // Prepara os valores de input para exibição nos cálculos
    // Fazemos o parseFloat aqui para usar na string de cálculo.
    // Os valores de n e k para exibição são atualizados no useEffect.
    const displayLambda = parseFloat(lambda);
    const displayMu = parseFloat(mu);

    return (
        <div className="calculator-container">
            <h2>Calculadora de Filas M/M/1 📊</h2>

            {/* Campos de input para lambda, mu, nUnits, targetN permanecem os mesmos */}
            <div className="input-group">
                <label htmlFor="lambda">Taxa de Chegada (λ):</label>
                <input type="number" id="lambda" value={lambda} onChange={(e) => setLambda(e.target.value)} step="0.1" min="0.01"/>
            </div>
            <div className="input-group">
                <label htmlFor="mu">Taxa de Atendimento (μ):</label>
                <input type="number" id="mu" value={mu} onChange={(e) => setMu(e.target.value)} step="0.1" min="0.01"/>
            </div>
            <div className="input-group">
                <label htmlFor="nUnits">Número de unidades (n) para P<sub>n</sub>:</label>
                <input type="number" id="nUnits" value={nUnits} onChange={(e) => setNUnits(e.target.value)} step="1" min="0"/>
            </div>
            <div className="input-group">
                <label htmlFor="targetN">Capacidade do sistema (k) para P(N ≤ k) e P(N > k):</label>
                <input type="number" id="targetN" value={targetN} onChange={(e) => setTargetN(e.target.value)} step="1" min="0"/>
            </div>

            {error && <p className="error-message">{error}</p>}

            {results && !error && (
                <div className="results-grid">
                    <h3>Resultados:</h3>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Taxa de Utilização (ρ):</strong>
                            <span>{(results.rho * 100).toFixed(1)}%</span>
                        </div>
                        <div className="calculation-steps">
                            {`Cálculo: ${displayLambda} / ${displayMu} = ${results.rho.toFixed(4)}`}
                        </div>
                        <div className="formula-text">ρ = λ / μ</div>
                    </div>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Prob. de Sistema Vazio (P<sub>0</sub>):</strong>
                            <span>{(results.p0 * 100).toFixed(1)}%</span>
                        </div>
                        <div className="calculation-steps">
                            {`Cálculo: 1 - ${results.rho.toFixed(4)} = ${results.p0.toFixed(4)}`}
                        </div>
                        <div className="formula-text">P<sub>0</sub> = 1 - ρ</div>
                    </div>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Prob. de {nUnits} cliente(s) no sistema (P<sub>{nUnits}</sub>):</strong>
                            <span>{(results.pn_val * 100).toFixed(1)}%</span>
                        </div>
                        <div className="calculation-steps">
                            {`Cálculo: ${results.p0.toFixed(4)} * (${results.rho.toFixed(4)})^${nValForDisplay} = ${results.pn_val.toFixed(4)}`}
                        </div>
                        <div className="formula-text">P<sub>n</sub> = P<sub>0</sub> ⋅ ρ<sup>n</sup></div>
                    </div>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Prob. de até {targetN} cliente(s) no sistema (P(N ≤ {targetN})):</strong>
                            <span>{(results.p_less_equal_k * 100).toFixed(1)}%</span>
                        </div>
                        <div className="calculation-steps">
                            {`Cálculo: 1 - (${results.rho.toFixed(4)})^(${kValForDisplay}+1) = ${results.p_less_equal_k.toFixed(4)}`}
                        </div>
                        <div className="formula-text">P(N ≤ k) = 1 - ρ<sup>k+1</sup></div>
                    </div>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Prob. de mais de {targetN} cliente(s) no sistema (P(N > {targetN})):</strong>
                            <span>{(results.p_greater_than_k * 100).toFixed(1)}%</span>
                        </div>
                        <div className="calculation-steps">
                            {`Cálculo: (${results.rho.toFixed(4)})^(${kValForDisplay}+1) = ${results.p_greater_than_k.toFixed(4)}`}
                        </div>
                        <div className="formula-text">P(N > k) = ρ<sup>k+1</sup></div>
                    </div>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Nº Médio de Clientes no Sistema (L):</strong>
                            <span>{results.l_sistema.toFixed(3)}</span>
                        </div>
                        <div className="calculation-steps">
                            {`Cálculo: ${displayLambda} / (${displayMu} - ${displayLambda}) = ${results.l_sistema.toFixed(4)}`}
                        </div>
                        <div className="formula-text">L = λ / (μ - λ)</div>
                    </div>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Nº Médio de Clientes na Fila (L<sub>q</sub>):</strong>
                            <span>{results.l_fila.toFixed(3)}</span>
                        </div>
                        <div className="calculation-steps">
                            {`Cálculo: ${results.l_sistema.toFixed(4)} - ${results.rho.toFixed(4)} = ${results.l_fila.toFixed(4)}`}
                        </div>
                        <div className="formula-text">L<sub>q</sub> = L - ρ</div>
                    </div>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Tempo Médio no Sistema (W):</strong>
                            <span>{results.w_sistema.toFixed(3)}</span>
                        </div>
                        <div className="calculation-steps">
                            {`Cálculo: ${results.l_sistema.toFixed(4)} / ${displayLambda} = ${results.w_sistema.toFixed(4)}`}
                        </div>
                        <div className="formula-text">W = L / λ</div>
                    </div>

                    <div className="result-item">
                        <div className="result-label-value">
                            <strong>Tempo Médio na Fila (W<sub>q</sub>):</strong>
                            <span>{results.w_fila.toFixed(3)}</span>
                        </div>
                        <div className="calculation-steps">
                            {`Cálculo: ${results.l_fila.toFixed(4)} / ${displayLambda} = ${results.w_fila.toFixed(4)}`}
                        </div>
                        <div className="formula-text">W<sub>q</sub> = L<sub>q</sub> / λ</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QueueCalculator;