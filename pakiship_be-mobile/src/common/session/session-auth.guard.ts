import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { parseCookieHeader, readSessionToken, SESSION_COOKIE } from "./session.util";

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // Try cookie first (web), then Authorization header (mobile)
    const cookies = parseCookieHeader(request.headers.cookie);
    const cookieToken = cookies[SESSION_COOKIE];

    const authHeader = request.headers.authorization as string | undefined;
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : undefined;

    const session = readSessionToken(cookieToken ?? bearerToken);

    if (!session) {
      throw new UnauthorizedException("You must be logged in to access this resource.");
    }

    request.user = session;
    return true;
  }
}
