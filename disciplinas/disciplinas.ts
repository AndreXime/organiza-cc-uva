import { DisciplinasType } from '../lib/types';
import { disc, h, req } from '../lib/utils';

const Disciplinas: DisciplinasType = {
    periodo1: [
        disc(1, 'Lógica de Programação', h(['Segunda', '14:00', '17:30'], ['Terça', '14:00', '17:30'])),
        disc(2, 'Cálculo I', h(['Segunda', '8:00', '9:40'], ['Quarta', '8:00', '11:30'])),
        disc(3, 'Lógica Matemática', h(['Terça', '8:00', '11:30'], ['Quarta', '14:00', '15:40'])),
        disc(4, 'ICC', h(['Quinta', '8:00', '11:30'])),
        disc(5, 'Inglês', h(['Sexta', '8:00', '11:30'])),
    ],
    periodo2: [
        disc(6, 'Matemática Discreta', h(['Segunda', '9:50', '11:30'], ['Quinta', '8:00', '11:30']), req(3)),
        disc(7, 'Circuitos Digitais', h(['Quarta', '8:00', '11:30']), req(3)),
        disc(8, 'Linguagens de Programação 1', h(['Terça', '8:00', '11:30']), req(1)),
        disc(9, 'Laboratorio de Programação', h(['Quinta', '14:00', '17:30']), req(1)),
        disc(10, 'Calculo 2', h(['Segunda', '14:00', '17:30'], ['Segunda', '18:30', '20:10']), req(2)),
        disc(11, 'Algebra linear', h(['Terça', '18:30', '22:00'])),
    ],
    periodo3: [
        disc(12, 'Introdução a Estatística', h(['Quinta', '18:30', '22:00'])),
        disc(13, 'Arquitetura de Computadores', h(['Segunda', '8:00', '11:30']), req(7)),
        disc(14, 'Estrutura de Dados', h(['Terça', '14:00', '17:30'], ['Sexta', '8:00', '11:30']), req(8, 9)),
        disc(15, 'Cálculo Numérico', h(['Quinta', '14:00', '17:30']), req(11, 10, 9)),
        disc(16, 'Física', h(['Terça', '20:20', '22:00'], ['Quarta', '18:30', '22:00'])),
    ],
    periodo4: [
        disc(17, 'Estatística Computacional', h(['Quarta', '8:00', '11:30']), req(12)),
        disc(18, 'Banco de Dados I', h(['Terça', '18:30', '20:10'], ['Quarta', '18:30', '22:00']), req(14)),
        disc(19, 'Algoritmos para Grafos', h(['Segunda', '8:00', '11:30']), req(6, 14)),
        disc(20, 'POO', h(['Segunda', '18:30', '22:00'], ['Quarta', '15:50', '18:20']), req(14)),
        disc(21, 'TI', h(['Terça', '18:30', '22:00']), req(4)),
        disc(22, 'MTC', h(['Segunda', '18:30', '22:00'])),
    ],
    periodo5: [
        disc(23, 'CANA', h(['Terça', '8:00', '11:30'], ['Quinta', '14:00', '15:40']), req(19)),
        disc(24, 'Engenharia de Software', h(['Segunda', '14:00', '17:30']), req(18)),
        disc(25, 'Banco de Dados II', h(['Terça', '14:50', '16:40'], ['Quarta', '8:00', '11:30']), req(18, 20)),
        disc(26, 'Computação Gráfica', h(['Quinta', '8:00', '11:30']), req(20, 11)),
    ],
    periodo6: [
        disc(27, 'Autômatos', h(['Quarta', '14:00', '17:30'], ['Quinta', '15:50', '17:30']), req(6)),
        disc(28, 'Sistemas Operacionais', h(['Segunda', '18:30', '22:00'], ['Terça', '18:30', '20:10']), req(13)),
        disc(29, 'Analise e Projeto de Sistemas', h(['Sexta', '14:00', '17:30']), req(24)),
        disc(30, 'Redes de Computadores', h(['Terça', '20:20', '22:00'], ['Quinta', '18:30', '22:00']), req(16, 13)),
    ],
    periodo7: [
        disc(31, 'IA', h(['Quarta', '14:00', '16:40'], ['Quinta', '14:00', '16:40']), req(3, 8)),
        disc(32, 'Compiladores', h(['Terça', '14:00', '17:30'], ['Terça', '18:30', '20:10']), req(27, 9)),
        disc(33, 'Sistemas Distribuídos', h(['Quarta', '18:30', '22:00']), req(28, 30)),
        disc(34, 'Computação e Sociedade', h(['Quarta', '8:00', '11:30'])),
    ],
    periodo8: [
        disc(35, 'Administração de Sistemas e Serviços', h(['Terça', '8:00', '11:30'])),
        disc(36, 'Laboratório de Desenvolvimento de Software', h(['Segunda', '18:30', '22:00']), req(25, 29)),
        disc(37, 'Projeto de Conclusão de Curso TCC', undefined, req(15, 25, 23, 31, 33)),
    ],
};

export default Disciplinas;
