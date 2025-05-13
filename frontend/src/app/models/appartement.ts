export class Appartement {
    
    constructor(
        public id?: number,
        public title?: string | null | undefined,
        public description?: string | null | undefined,
        public adresse?: string | null | undefined,
        public ville?: string | null | undefined,
        public codePostal?: string | null | undefined,
        public surface?: number | null | undefined,
        public prix?: number | null | undefined,
        public nombreChambres?: number | null | undefined,
        public type?: 'Appartement' | 'Maison' | 'Villa' | 'Studio',
        public parking?: boolean | null | undefined,
        public garage?: boolean | null | undefined,
        public images?: string[] | null | undefined,
    ) {}

}
