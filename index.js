const consultas = [];
const medicos = [];

function exibirMenu() {
  console.log(`
Escolha uma opção:
1. Adicionar uma nova consulta
2. Listar todas as consultas
3. Atualizar uma consulta existente
4. Cancelar uma consulta
5. Adicionar um novo médico
6. Listar todos os médicos
7. Pesquisar por um paciente
8. Pesquisar por um médico
9. Sair
`);
}

function adicionarConsulta(callback) {
  const consulta = {};
  let step = 0;

  function nextStep() {
    if (step === 0) {
      console.log('Nome do paciente:');
    } else if (step === 1) {
      console.log('Nome do médico (existentes: ' + medicos.join(', ') + '):');
    } else if (step === 2) {
      console.log('Data (dd/mm/yyyy):');
    } else if (step === 3) {
      console.log('Hora (HH:mm):');
    }
  }

  nextStep();

  process.stdin.on('data', function handler(data) {
    const input = data.toString().trim();

    if (step === 0) {
      consulta.nomePaciente = input;
      step++;
      nextStep();
    } else if (step === 1) {
      consulta.nomeMedico = input;
      if (!medicos.includes(input)) {
        medicos.push(input);
      }
      step++;
      nextStep();
    } else if (step === 2) {
      consulta.data = input;
      step++;
      nextStep();
    } else if (step === 3) {
      consulta.hora = input;
      consultas.push(consulta);
      const numeroConsulta = consultas.length;
      console.log(`Consulta agendada com sucesso! Número da consulta: ${numeroConsulta}.`);
      console.log(`Paciente: ${consulta.nomePaciente}, por favor anote o número da sua consulta para confirmação ou edição futura.`);
      console.log('----------------------------------------------');
      process.stdin.removeListener('data', handler);
      callback();
    }
  });
}

function listarConsultas(callback) {
  if (consultas.length === 0) {
    console.log('Nenhuma consulta agendada.');
  } else {
    console.log('Consultas Agendadas:');
    consultas.forEach((consulta, index) => {
      console.log(`${index + 1}. Paciente: ${consulta.nomePaciente}, Médico: ${consulta.nomeMedico}, Data: ${consulta.data}, Hora: ${consulta.hora}`);
    });
  }
  console.log('----------------------------------------------');
  callback();
}

function atualizarConsulta(callback) {
  console.log('Digite o número da consulta a ser atualizada:');
  process.stdin.once('data', (data) => {
    const index = parseInt(data.toString().trim());

    if (index >= 0 && index < consultas.length) {
      const consulta = consultas[index];
      let step = 0;
      console.log(`Atualizando consulta de ${consulta.nomePaciente}`);
      console.log('Novo nome do paciente (deixe em branco para manter o atual):');

      function nextStep() {
        if (step === 0) {
          console.log('Novo nome do paciente (deixe em branco para manter o atual):');
        } else if (step === 1) {
          console.log('Novo nome do médico (existentes: ' + medicos.join(', ') + ') (deixe em branco para manter o atual):');
        } else if (step === 2) {
          console.log('Nova data (deixe em branco para manter a atual):');
        } else if (step === 3) {
          console.log('Nova hora (deixe em branco para manter a atual):');
        }
      }

      nextStep();

      process.stdin.on('data', function handler(data) {
        const input = data.toString().trim();

        if (step === 0) {
          if (input) consulta.nomePaciente = input;
          step++;
          nextStep();
        } else if (step === 1) {
          if (input) consulta.nomeMedico = input;
          if (!medicos.includes(input)) {
            medicos.push(input);
          }
          step++;
          nextStep();
        } else if (step === 2) {
          if (input) consulta.data = input;
          step++;
          nextStep();
        } else if (step === 3) {
          if (input) consulta.hora = input;
          console.log('Consulta atualizada com sucesso.');
          console.log('----------------------------------------------');
          process.stdin.removeListener('data', handler);
          callback();
        }
      });
    } else {
      console.log('Número de consulta inválido.');
      console.log('----------------------------------------------');
      callback();
    }
  });
}

function cancelarConsulta(callback) {
  console.log('Digite o número da consulta a ser cancelada:');
  process.stdin.once('data', (data) => {
    const index = parseInt(data.toString().trim());

    if (index >= 0 && index < consultas.length) {
      consultas.splice(index, 1);
      console.log('Consulta cancelada com sucesso.');
    } else {
      console.log('Número de consulta inválido.');
    }
    console.log('----------------------------------------------');
    callback();
  });
}

function adicionarMedico(callback) {
  console.log('Nome do novo médico:');
  process.stdin.once('data', (data) => {
    const nomeMedico = data.toString().trim();
    if (!medicos.includes(nomeMedico)) {
      medicos.push(nomeMedico);
      console.log(`Médico ${nomeMedico} adicionado com sucesso.`);
    } else {
      console.log(`Médico ${nomeMedico} já está cadastrado.`);
    }
    console.log('----------------------------------------------');
    callback();
  });
}

function listarMedicos(callback) {
  if (medicos.length === 0) {
    console.log('Nenhum médico cadastrado.');
  } else {
    console.log('Médicos Cadastrados:');
    medicos.forEach((medico, index) => {
      console.log(`${index + 1}. ${medico}`);
    });
  }
  console.log('----------------------------------------------');
  callback();
}

function pesquisarPaciente(callback) {
  console.log('Digite o nome do paciente a ser pesquisado:');
  process.stdin.once('data', (data) => {
    const nomePaciente = data.toString().trim();
    const resultado = consultas.filter(consulta => consulta.nomePaciente.toLowerCase() === nomePaciente.toLowerCase());
    if (resultado.length === 0) {
      console.log('Paciente não encontrado.');
    } else {
      console.log(`Consultas do paciente ${nomePaciente}:`);
      resultado.forEach((consulta, index) => {
        console.log(`${index + 1}. Médico: ${consulta.nomeMedico}, Data: ${consulta.data}, Hora: ${consulta.hora}`);
      });
    }
    console.log('----------------------------------------------');
    callback();
  });
}

function pesquisarMedico(callback) {
  console.log('Digite o nome do médico a ser pesquisado:');
  process.stdin.once('data', (data) => {
    const nomeMedico = data.toString().trim();
    if (medicos.includes(nomeMedico)) {
      const resultado = consultas.filter(consulta => consulta.nomeMedico.toLowerCase() === nomeMedico.toLowerCase());
      if (resultado.length === 0) {
        console.log('Nenhuma consulta encontrada para este médico.');
      } else {
        console.log(`Consultas do médico ${nomeMedico}:`);
        resultado.forEach((consulta, index) => {
          console.log(`${index + 1}. Paciente: ${consulta.nomePaciente}, Data: ${consulta.data}, Hora: ${consulta.hora}`);
        });
      }
    } else {
      console.log('Médico não encontrado.');
    }
    console.log('----------------------------------------------');
    callback();
  });
}

function main() {
  console.log('Sistema de Gerenciamento de Consultas da Clínica Médica');
  exibirMenu();
  process.stdin.on('data', function handler(data) {
    const input = data.toString().trim();
    if (!isNaN(input)) {
      switch (parseInt(input)) {
        case 1:
          process.stdin.removeListener('data', handler);
          adicionarConsulta(main);
          break;
        case 2:
          process.stdin.removeListener('data', handler);
          listarConsultas(main);
          break;
        case 3:
          process.stdin.removeListener('data', handler);
          atualizarConsulta(main);
          break;
        case 4:
          process.stdin.removeListener('data', handler);
          cancelarConsulta(main);
          break;
        case 5:
          process.stdin.removeListener('data', handler);
          adicionarMedico(main);
          break;
        case 6:
          process.stdin.removeListener('data', handler);
          listarMedicos(main);
          break;
        case 7:
          process.stdin.removeListener('data', handler);
          pesquisarPaciente(main);
          break;
        case 8:
          process.stdin.removeListener('data', handler);
          pesquisarMedico(main);
          break;
        case 9:
          process.exit();
          break;
        default:
          console.log('Opção inválida.');
          exibirMenu();
      }
    } else {
      console.log('Opção inválida.');
      exibirMenu();
    }
  });
}

main();     
