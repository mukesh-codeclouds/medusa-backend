import {
    createStep,
    StepResponse,
    createWorkflow,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk"
  import { BRAND_MODULE } from "../modules/brand"
  import BrandModuleService from "../modules/brand/service"
  
  // Step Input Type
  export type CreateBrandStepInput = {
    name: string
  }
  
  // Step: Create Brand with rollback
  export const createBrandStep = createStep(
    "create-brand-step",
    async (input: CreateBrandStepInput, { container }) => {
      const brandService = container.resolve<BrandModuleService>(BRAND_MODULE)
      const brand = await brandService.createBrands(input)
  
      return new StepResponse(brand, brand.id)
    },
    async (brandId: string, { container }) => {
      const brandService = container.resolve<BrandModuleService>(BRAND_MODULE)
      await brandService.deleteBrands(brandId)
    }
  )
  
  // Workflow Input Type
  export type CreateBrandWorkflowInput = CreateBrandStepInput
  
  // Workflow: Create Brand Workflow
  export const createBrandWorkflow = createWorkflow(
    "create-brand",
    (input: CreateBrandWorkflowInput) => {
      const brand = createBrandStep(input)
      return new WorkflowResponse(brand)
    }
  )
  