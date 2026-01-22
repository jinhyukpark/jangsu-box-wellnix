-- main_page_settings 테이블에 히어로 배너 컬럼 추가
ALTER TABLE main_page_settings ADD COLUMN IF NOT EXISTS hero_image TEXT;
ALTER TABLE main_page_settings ADD COLUMN IF NOT EXISTS hero_link TEXT;
ALTER TABLE main_page_settings ADD COLUMN IF NOT EXISTS hero_enabled BOOLEAN DEFAULT TRUE;
