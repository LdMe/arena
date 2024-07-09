import React from 'react';
import './Intro.css'; // Asegúrate de crear este archivo CSS para los estilos

const Introduction = ({ onEnd }) => {
  return (
    <div className="introduction">
      <div className="intro-content">
      <h1>Bienvenido al Coliseo</h1>
        <section>
          <h2>¡Salve, guerrero recién llegado!</h2>
          <p>Soy Máximo Décimo Meridio, director de este glorioso coliseo, y te doy la bienvenida a la arena más feroz del imperio.</p>
          <p>Escúchame bien, novato, pues lo que estás a punto de experimentar no es un simple juego, sino una prueba de valor, astucia y estrategia. En esta arena, te enfrentarás a uno o varios oponentes en un combate donde solo el más hábil sobrevivirá.</p>
        </section>

        <section>
          <h3>Reglas Básicas</h3>
          <ul>
            <li>Cada gladiador comienza con 100 puntos de salud y 100 puntos de energía.</li>
            <li>Tu objetivo es ser el último en pie, reduciendo la salud de tus adversarios a cero.</li>
          </ul>

          <h4>Acciones Posibles:</h4>
          <ol>
            <li><strong>Atacar:</strong> Inflige 25 puntos de daño si tu oponente no está defendido, o rompe su defensa si lo está. Cuesta 15 puntos de energía.</li>
            <li><strong>Defenderte:</strong> Te protege de cualquier ataque hasta que recibas un golpe. Cuesta 25 puntos de energía.</li>
            <li><strong>Descansar:</strong> Recupera 20 puntos de energía. Si ya estás defendido, mantendrás tu protección.</li>
          </ol>
        </section>

        <section>
          <h3>Estrategia</h3>
          <p>La verdadera clave de la victoria está en tu estrategia. Antes del combate, deberás crear una serie de bloques estratégicos. Cada bloque consta de una o varias condiciones y una acción a realizar si esas condiciones se cumplen.</p>
          <ul>
            <li>Las condiciones pueden ser simples, como "si mi salud es menor que 50", o compuestas, combinando varias condiciones con "y" u "o". Por ejemplo: "si mi energía es menor que 30 Y la salud del enemigo es mayor que la mía".</li>
            <li>Los bloques se evalúan en orden, ejecutando solo la primera acción cuyas condiciones se cumplan.</li>
          </ul>
        </section>

        <section>
          <h3>Áreas de Juego</h3>
          <dl>
            <dt>Área de Entrenamiento</dt>
            <dd>Aquí podrás poner a prueba tu estrategia contra oponentes predefinidos o contra las estrategias de otros gladiadores.</dd>
            <dt>El Coliseo</dt>
            <dd>El corazón de la acción. Crea tu propia arena y desafía a otros jugadores a combates en tiempo real.</dd>
          </dl>
        </section>

        <blockquote>
          El público está sediento de sangre y espectáculo. Tu destino está en tus manos. ¿Serás el campeón que se alce victorioso en el Coliseo o caerás como tantos otros antes que tú?
        </blockquote>

        <p className="closing">¡Que los dioses te favorezcan en la arena! ¡Ave, César! ¡Los que van a morir te saludan!</p>
      </div>
      <button onClick={() => onEnd("menu")} className="exit-button footer">
        Continuar al Menú Principal
      </button>
    </div>
  );
};

export default Introduction;