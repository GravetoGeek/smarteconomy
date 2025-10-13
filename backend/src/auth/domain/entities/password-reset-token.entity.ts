export class PasswordResetToken {
    constructor(
        public readonly userId: string,
        public readonly token: string,
        public readonly expiresAt: Date,
        public readonly used: boolean=false
    ) {}
}
