package com.toastedbits.codeconnect.test.functional;

import org.gradle.api.Action;
import org.gradle.api.Project;
import org.gradle.api.Task;
import org.gradle.testfixtures.ProjectBuilder;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;

import com.toastedbits.plugins.codeconnect.CodeConnectGradleExtension;

//TODO: Find a way to add some dependencies to the dummy project
@Ignore("Depends on local neo4j server configured")
public class PluginTest {
	private static Project project;

	@BeforeClass
	public static void setup() {
		project = ProjectBuilder.builder().build();
		project.getPluginManager().apply("codeconnect");
		CodeConnectGradleExtension ccExt = project.getExtensions().getByType(CodeConnectGradleExtension.class);
		project.setGroup("cc-test");
		project.setVersion("0.0.1");
//		ccExt.setUrl("http://localhost:7474");
//		ccExt.setUsername("neo4j");
		ccExt.setPassword("admin");
	}

	@Test
	public void testReportUpstream() {
		Task reportUpstream = project.getTasksByName("reportUpstream", false).iterator().next();
		for(Action<? super Task> action : reportUpstream.getActions()) {
			action.execute(reportUpstream);
		}
	}

	@Test
	public void testShowDownstream() {
		Task showDownstream = project.getTasksByName("showDownstream", false).iterator().next();
		for(Action<? super Task> action : showDownstream.getActions()) {
			action.execute(showDownstream);
		}
	}
}
