// Interfacce di typescript

export interface Utente{
    Username: string,
    BadgeEQ: number,
    PVinte: number,
    PGiocate: number,
    Tema: number,
    Online: number,
    Occupato: number,
};

export interface Amico{
    Username: string,
    PVinte: number,
    PGiocate: number,
    Online: number,
    Occupato: number,
};

export interface Badge{
    IDBadge: number,
    Nome: string,
    Missione: string,
};

export interface Categoria{
    IDCategoria: number,
    Nome: string,
};

export interface Domanda{
    IDDomanda: number,
    Testo: string,
    Spiegazione: string,
    Categoria: number,
};

export interface Risposta{
    IDRisposta: number,
    Testo: string,
    Correttezza: number,
};