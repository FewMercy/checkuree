// role.guard.ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from './const/role-type.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleType[]>('roles', context.getHandler());

    if (!roles) {
      // roles 데코레이터가 없으면 허용
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const attendanceId = request.body.attendanceId || request.params.attendanceId; // 출석부 ID를 요청에서 가져옴

    if (!user || !user.userAttendance || user.userAttendance.length === 0) {
      // 사용자가 인증되지 않았거나 역할이 없는 경우 거부
      return false;
    }

    // 사용자의 출석부 중 attendanceId와 일치하는 출석부가 있는지 검증
    const userRoleForAttendance = user.userAttendance.find((data) => data.attendanceId === attendanceId);

    if (!userRoleForAttendance) {
      // 사용자가 해당 출석부에 대한 역할이 없는 경우 거부
      return false;
    }

    // 출석부에 설정된 역할 중에서 하나라도 허용된 역할이 있는지 확인
    // 한 개의 attendanceId에 대해 반드시 한 개의 userAttendance만 가진다.
    return roles.includes(userRoleForAttendance.role);
  }
}
