import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

export function initPassport() {
    // Local: email + password
    passport.use(new LocalStrategy(
        { usernameField: "email", passwordField: "password", session: true },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user || !user.password) return done(null, false, { message: "Credenciales inválidas" });
                const ok = await bcrypt.compare(password, user.password);
                if (!ok) return done(null, false, { message: "Credenciales inválidas" });
                return done(null, {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    age: user.age,
                    role: user.role
                });
            } catch (err) { return done(err); }
        }
    ));

    // GitHub OAuth
    passport.use(new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;
                let user = await User.findOne({ $or: [{ githubId: profile.id }, { email }] });
                if (!user) {
                    user = await User.create({
                        first_name: profile.displayName || profile.username || "GitHub",
                        last_name: "User",
                        email,
                        age: 18,
                        githubId: profile.id
                    });
                }
                return done(null, {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    age: user.age,
                    role: user.role
                });
            } catch (err) { return done(err); }
        }
    ));

    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        try {
            const u = await User.findById(id).lean();
            if (!u) return done(null, false);
            done(null, { _id: u._id, first_name: u.first_name, last_name: u.last_name, email: u.email, age: u.age, role: u.role });
        } catch (err) { done(err); }
    });
}