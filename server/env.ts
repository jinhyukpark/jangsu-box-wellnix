/**
 * 환경 변수 로딩 유틸리티
 * - Replit 환경: Secret에서 자동으로 환경 변수 로드 (REPL_ID 존재 시)
 * - 로컬 환경 (Cursor 등): .env 파일에서 환경 변수 로드
 * - 우선순위: 시스템 환경 변수 > .env 파일
 */

import dotenv from "dotenv";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

/**
 * Replit 환경인지 확인
 */
function isReplit(): boolean {
  return !!(
    process.env.REPL_ID ||
    process.env.REPL_SLUG ||
    process.env.REPL_OWNER
  );
}

// 중복 로드 방지 플래그
let envLoaded = false;

/**
 * 환경 변수 로드
 * - Replit 환경: Secret이 자동으로 환경 변수로 설정되므로 .env 파일 로드 불필요
 * - 로컬 환경: .env 파일이 있으면 로드, 없으면 무시 (에러 없이)
 * - 중복 로드 방지: 한 번만 실행됨
 */
function loadEnv(): void {
  // 이미 로드되었으면 스킵
  if (envLoaded) {
    return;
  }

  // Replit 환경에서는 .env 파일을 로드하지 않음 (Secret 사용)
  if (isReplit()) {
    envLoaded = true;
    return;
  }

  // 로컬 환경: .env 파일 경로 찾기
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const envPath = resolve(__dirname, "..", ".env");

  // .env 파일이 있으면 로드, 없으면 무시
  if (existsSync(envPath)) {
    const result = dotenv.config({ 
      path: envPath,
      override: false, // 이미 설정된 환경 변수는 덮어쓰지 않음
    });
    if (result.error) {
      console.warn(`[env] .env 파일 로드 중 경고: ${result.error.message}`);
    } else {
      const loadedCount = Object.keys(result.parsed || {}).length;
      if (loadedCount > 0) {
        console.log(`[env] .env 파일에서 ${loadedCount}개의 환경 변수 로드 완료 (로컬 환경)`);
      }
    }
  } else {
    console.log(`[env] .env 파일이 없습니다. 시스템 환경 변수를 사용합니다.`);
  }

  envLoaded = true;
}

// 환경 변수 로드 실행
loadEnv();

/**
 * 환경 변수 가져오기 (기본값 지원)
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`환경 변수 ${key}가 설정되지 않았습니다.`);
  }
  return value;
}

/**
 * 환경 변수 가져오기 (선택적, 기본값 없으면 undefined 반환)
 */
export function getEnvOptional(key: string): string | undefined {
  return process.env[key];
}

/**
 * 현재 환경 정보 출력 (디버깅용)
 */
export function printEnvInfo(): void {
  const env = isReplit() ? "Replit" : "로컬";
  console.log(`[env] 실행 환경: ${env}`);
  if (isReplit()) {
    console.log(`[env] REPL_ID: ${process.env.REPL_ID || "없음"}`);
  }
}
