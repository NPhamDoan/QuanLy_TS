import { randomUUID } from "crypto";
import { getSupabase } from "./client.js";
import { throwIfError } from "./error-map.js";
import { logQuery, logQueryError } from "../../logger.js";
import type { TepDinhKem } from "../../domain/entities.js";
import type {
  ITepDinhKemRepository,
  CreateTepDinhKemInput,
} from "../interfaces.js";

export class SupabaseTepDinhKemRepository implements ITepDinhKemRepository {
  async findById(maTep: string): Promise<TepDinhKem | null> {
    logQuery("SupabaseTepDinhKemRepository", "findById", { maTep });
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("TepDinhKem")
        .select("*")
        .eq("maTep", maTep)
        .maybeSingle();
      if (error) throwIfError(error);
      return (data as TepDinhKem) || null;
    } catch (err) {
      logQueryError("SupabaseTepDinhKemRepository", "findById", err);
      throw err;
    }
  }

  async findByHoSo(maHoSo: string): Promise<TepDinhKem[]> {
    logQuery("SupabaseTepDinhKemRepository", "findByHoSo", { maHoSo });
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("TepDinhKem")
        .select("*")
        .eq("maHoSo", maHoSo);
      if (error) throwIfError(error);
      return (data as TepDinhKem[]) || [];
    } catch (err) {
      logQueryError("SupabaseTepDinhKemRepository", "findByHoSo", err);
      throw err;
    }
  }

  async create(data: CreateTepDinhKemInput): Promise<TepDinhKem> {
    logQuery("SupabaseTepDinhKemRepository", "create", { data });
    try {
      const maTep = randomUUID();
      const row: TepDinhKem = { maTep, ...data };
      const supabase = getSupabase();
      const { error } = await supabase.from("TepDinhKem").insert(row);
      if (error) throwIfError(error);
      return row;
    } catch (err) {
      logQueryError("SupabaseTepDinhKemRepository", "create", err);
      throw err;
    }
  }

  async delete(maTep: string): Promise<void> {
    logQuery("SupabaseTepDinhKemRepository", "delete", { maTep });
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("TepDinhKem")
        .delete()
        .eq("maTep", maTep);
      if (error) throwIfError(error);
    } catch (err) {
      logQueryError("SupabaseTepDinhKemRepository", "delete", err);
      throw err;
    }
  }
}
