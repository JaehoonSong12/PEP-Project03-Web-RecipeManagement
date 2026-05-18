package com.ydjs;

import java.sql.SQLException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.ydjs.controller.AuthenticationController;
import com.ydjs.controller.IngredientController;
import com.ydjs.controller.RecipeController;
import com.ydjs.dao.ChefDAO;
import com.ydjs.dao.IngredientDAO;
import com.ydjs.dao.RecipeDAO;
import com.ydjs.service.AuthenticationService;
import com.ydjs.service.ChefService;
import com.ydjs.service.IngredientService;
import com.ydjs.service.RecipeService;
import com.ydjs.util.ConnectionUtil;
import com.ydjs.util.JavalinAppUtil;

public class JavalinConfigTest {

	private RecipeDAO recipeDao;
	private RecipeService recipeService;
	private RecipeController recipeController;
	private ChefDAO chefDao;
	private ChefService chefService;
	private AuthenticationService authService;
	private AuthenticationController authController;
	private IngredientDAO ingredientDao;
	private IngredientService ingredientService;
	private IngredientController ingredientController;

	@BeforeEach
	void setUpTestsData() throws SQLException {

		chefDao = new ChefDAO(new ConnectionUtil());
		chefService = new ChefService(chefDao);
		authService = new AuthenticationService(chefService);
		authController = new AuthenticationController(chefService, authService);

		ingredientDao = new IngredientDAO(new ConnectionUtil());
		ingredientService = new IngredientService(ingredientDao);
		ingredientController = new IngredientController(ingredientService);

		recipeDao = new RecipeDAO(chefDao, ingredientDao, new ConnectionUtil());
		recipeService = new RecipeService(recipeDao);
		recipeController = new RecipeController(recipeService, authService);
	}

	@Test
	public void test() {

		new JavalinAppUtil(recipeController, authController, ingredientController).getApp().start();

	}

}
