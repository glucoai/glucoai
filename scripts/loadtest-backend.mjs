import autocannon from 'autocannon';

const url = process.env.LOADTEST_URL ?? 'http://localhost:3000/saude';
const connections = Number(process.env.LOADTEST_CONNECTIONS ?? 50);
const duration = Number(process.env.LOADTEST_DURATION ?? 30);

autocannon(
  {
    url,
    connections: Number.isFinite(connections) ? connections : 50,
    duration: Number.isFinite(duration) ? duration : 30,
  },
  (erro, resultado) => {
    if (erro) {
      console.error(erro);
      process.exit(1);
    }
    console.log(autocannon.printResult(resultado));
  },
);
