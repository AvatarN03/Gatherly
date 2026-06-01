declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        name?: string | null;
        imageUrl?: string | null;
      };
      imageUrl?: string;
      imageFileId?: string;
    }
  }
}

export {};
